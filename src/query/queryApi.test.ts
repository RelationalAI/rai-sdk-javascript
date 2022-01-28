import nock from 'nock';

import {
  baseUrl,
  getMockConfig,
  makeTransactionRequest,
  makeTransactionResult,
} from '../testUtils';
import { Relation } from '../transaction/types';
import { QueryApi } from './queryApi';

describe('QueryApi', () => {
  const api = new QueryApi(getMockConfig());
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
    const request = makeTransactionRequest(
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
    const response = makeTransactionResult([
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

    const result = await api.query(database, engine, 'def output = 123');

    scope.done();

    expect(result).toEqual(expectedOutput);
  });

  it('should query with inputs', async () => {
    const request = makeTransactionRequest(
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
    const response = makeTransactionResult([
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
    const result = await api.query(database, engine, 'def output = 123', [
      { name: 'input1', value: 'value1' },
    ]);

    scope.done();

    expect(result).toEqual(expectedOutput);
  });

  it('should load json', async () => {
    const request = makeTransactionRequest(
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
            value: [
              'def config:data = data',
              'def insert:test_relation = load_json[config]',
            ].join('\n'),
            name: 'query',
          },
        },
      ],
      database,
      engine,
      false,
    );
    const response = makeTransactionResult([
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
    const result = await api.loadJson(database, engine, 'test_relation', {
      test: 123,
    });

    scope.done();

    expect(result).toEqual([]);
  });

  it('should load csv', async () => {
    const csv = 'foo,bar\n1,2';
    const request = makeTransactionRequest(
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
              columns: [[csv]],
            },
          ],
          source: {
            type: 'Source',
            path: 'query',
            value: [
              'def config:data = data',
              'def insert:test_relation = load_csv[config]',
            ].join('\n'),
            name: 'query',
          },
        },
      ],
      database,
      engine,
      false,
    );
    const response = makeTransactionResult([
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
    const result = await api.loadCsv(database, engine, 'test_relation', csv);

    scope.done();

    expect(result).toEqual([]);
  });

  it('should load csv with syntax', async () => {
    const csv = 'foo,bar\n1,2';
    const request = makeTransactionRequest(
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
              columns: [[csv]],
            },
          ],
          source: {
            type: 'Source',
            path: 'query',
            value: [
              'def config:data = data',
              'def config:syntax:header = (1, "foo"); (2, "bar")',
              `def config:syntax:delim = '|'`,
              `def config:syntax:quotechar = '\\''`,
              `def config:syntax:header_row = 1`,
              `def config:syntax:escapechar = ']'`,
              'def insert:test_relation = load_csv[config]',
            ].join('\n'),
            name: 'query',
          },
        },
      ],
      database,
      engine,
      false,
    );
    const response = makeTransactionResult([
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
    const result = await api.loadCsv(database, engine, 'test_relation', csv, {
      header: {
        1: 'foo',
        2: 'bar',
      },
      delim: '|',
      quotechar: "'",
      header_row: 1,
      escapechar: ']',
    });

    scope.done();

    expect(result).toEqual([]);
  });

  it('should load csv with schema', async () => {
    const csv = 'foo,bar\n1,test';
    const request = makeTransactionRequest(
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
              columns: [[csv]],
            },
          ],
          source: {
            type: 'Source',
            path: 'query',
            value: [
              'def config:data = data',
              'def config:schema:foo = "int"',
              'def config:schema:bar = "string"',
              'def insert:test_relation = load_csv[config]',
            ].join('\n'),
            name: 'query',
          },
        },
      ],
      database,
      engine,
      false,
    );
    const response = makeTransactionResult([
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
    const result = await api.loadCsv(
      database,
      engine,
      'test_relation',
      csv,
      undefined,
      {
        ':foo': 'int',
        ':bar': 'string',
      },
    );

    scope.done();

    expect(result).toEqual([]);
  });
});
