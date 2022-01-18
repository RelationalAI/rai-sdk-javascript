import nock from 'nock';

import * as endpoint from './query';
import { getMockContext, nockTransaction } from './testUtils';
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
  ];
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should query', async () => {
    const scope = nockTransaction(
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
      [
        {
          type: 'QueryActionResult',
          output: mockOutput,
        },
      ],
      database,
      engine,
    );
    const result = await endpoint.query(
      context,
      database,
      engine,
      'def output = 123',
    );

    scope.done();

    expect(result).toEqual(mockOutput);
  });

  it('should query with inputs', async () => {
    const scope = nockTransaction(
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
      [
        {
          type: 'QueryActionResult',
          output: mockOutput,
        },
      ],
      database,
      engine,
    );
    const result = await endpoint.query(
      context,
      database,
      engine,
      'def output = 123',
      [{ name: 'input1', value: 'value1' }],
    );

    scope.done();

    expect(result).toEqual(mockOutput);
  });
});
