import nock from 'nock';

import * as endpoint from './query';
import {
  baseUrl,
  getMockContext,
  mkTransactionRequest,
  mkTransactionResult,
} from './testUtils';
import { Relation } from './transaction';

describe('query', () => {
  const context = getMockContext();
  const mockOutput: Relation[] = [
    {
      rel_key: {
        values: [],
        name: 'output',
        keys: ['Int64'],
        type: 'RelKey',
      },
      type: 'Relation',
      columns: [[123]],
    },
    {
      rel_key: {
        values: [],
        name: 'foo',
        keys: ['Int64'],
        type: 'RelKey',
      },
      type: 'Relation',
      columns: [[111]],
    },
  ];
  const expectedOutput = [mockOutput[0]];
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should query', async () => {
    const request = mkTransactionRequest(
      [
        {
          type: 'QueryAction',
          outputs: [],
          persist: [],
          inputs: [],
          source: {
            type: 'Source',
            path: 'query',
            value: 'def output = 123',
            name: 'query',
          },
        },
      ],
      database,
      engine,
    );
    const response = mkTransactionResult([
      {
        type: 'QueryActionResult',
        output: [],
      },
    ]);
    response.output = mockOutput;

    const scope = nock(baseUrl)
      .post('/transaction', request)
      .query({
        dbname: database,
        open_mode: 'OPEN',
        region: 'us-east',
        compute_name: engine,
      })
      .reply(200, response);

    const result = await endpoint.query(
      context,
      database,
      engine,
      'def output = 123',
    );

    scope.done();

    expect(result).toEqual(expectedOutput);
  });

  it('should query with inputs', async () => {
    const request = mkTransactionRequest(
      [
        {
          type: 'QueryAction',
          outputs: [],
          persist: [],
          inputs: [
            {
              rel_key: {
                values: [],
                name: 'input1',
                keys: ['RAI_VariableSizeStrings.VariableSizeString'],
                type: 'RelKey',
              },
              type: 'Relation',
              columns: [['value1']],
            },
          ],
          source: {
            type: 'Source',
            path: 'query',
            value: 'def output = 123',
            name: 'query',
          },
        },
      ],
      database,
      engine,
    );
    const response = mkTransactionResult([
      {
        type: 'QueryActionResult',
        output: [],
      },
    ]);
    response.output = mockOutput;

    const scope = nock(baseUrl)
      .post('/transaction', request)
      .query({
        dbname: database,
        open_mode: 'OPEN',
        region: 'us-east',
        compute_name: engine,
      })
      .reply(200, response);
    const result = await endpoint.query(
      context,
      database,
      engine,
      'def output = 123',
      [{ name: 'input1', value: 'value1' }],
    );

    scope.done();

    expect(result).toEqual(expectedOutput);
  });

  it('should load json', async () => {
    const request = mkTransactionRequest(
      [
        {
          type: 'QueryAction',
          outputs: [],
          persist: [],
          inputs: [
            {
              rel_key: {
                values: [],
                name: 'data',
                keys: ['RAI_VariableSizeStrings.VariableSizeString'],
                type: 'RelKey',
              },
              type: 'Relation',
              columns: [['{"test":123}']],
            },
          ],
          source: {
            type: 'Source',
            path: 'query',
            value: `def config:data = data\ndef insert:test_relation = load_json[config]`,
            name: 'query',
          },
        },
      ],
      database,
      engine,
      false,
    );
    const response = mkTransactionResult([
      {
        type: 'QueryActionResult',
        output: [],
      },
    ]);

    const scope = nock(baseUrl)
      .post('/transaction', request)
      .query({
        dbname: database,
        open_mode: 'OPEN',
        region: 'us-east',
        compute_name: engine,
      })
      .reply(200, response);
    const result = await endpoint.loadJson(
      context,
      database,
      engine,
      'test_relation',
      { test: 123 },
    );

    scope.done();

    expect(result).toEqual([]);
  });
});
