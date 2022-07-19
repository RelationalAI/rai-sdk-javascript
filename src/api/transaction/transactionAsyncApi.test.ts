/**
 * Copyright 2021 RelationalAI, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { readFileSync } from 'fs';
import nock from 'nock';

import { baseUrl, getMockConfig } from '../../testUtils';
import { TransactionAsyncApi } from './transactionAsyncApi';
import { TransactionAsyncState } from './types';

const path = '/transactions';

const multipartMock = readFileSync(__dirname + '/mocks/multipart');
const protobufMock = readFileSync(__dirname + '/mocks/protobuf');
const multipartContentType =
  'multipart/form-data; boundary=28deee55b43d20e109a8fe119e47c5393620ea568b7059405c4cf23bad7b';

// def output = :foo
// def output = :"foo;bar", 1
// def output = 1
const transactionAsyncMock = {
  transaction: {
    id: '57216bf7-1728-4f1e-d382-26ac15db96a5',
    response_format_version: '2.0.3',
    state: 'COMPLETED',
  },
  problems: [],
  results: [
    { relationId: '/:output/:foo', table: expect.anything() },
    { relationId: '/:output/:foo;bar/Int64', table: expect.anything() },
    { relationId: '/:output/Int64', table: expect.anything() },
  ],
  metadata: {
    relations: [
      {
        fileName: '0.arrow',
        relationId: {
          arguments: [
            {
              tag: 3,
              primitiveType: 0,
              constantType: {
                relType: {
                  tag: 1,
                  primitiveType: 17,
                },
                value: {
                  arguments: [
                    {
                      tag: 17,
                      value: {
                        oneofKind: 'stringVal',
                        stringVal: new Uint8Array([
                          111,
                          117,
                          116,
                          112,
                          117,
                          116,
                        ]),
                      },
                    },
                  ],
                },
              },
            },
            {
              tag: 3,
              primitiveType: 0,
              constantType: {
                relType: {
                  tag: 1,
                  primitiveType: 17,
                },
                value: {
                  arguments: [
                    {
                      tag: 17,
                      value: {
                        oneofKind: 'stringVal',
                        stringVal: new Uint8Array([102, 111, 111]),
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        fileName: '1.arrow',
        relationId: {
          arguments: [
            {
              tag: 3,
              primitiveType: 0,
              constantType: {
                relType: {
                  tag: 1,
                  primitiveType: 17,
                },
                value: {
                  arguments: [
                    {
                      tag: 17,
                      value: {
                        oneofKind: 'stringVal',
                        stringVal: new Uint8Array([
                          111,
                          117,
                          116,
                          112,
                          117,
                          116,
                        ]),
                      },
                    },
                  ],
                },
              },
            },
            {
              tag: 3,
              primitiveType: 0,
              constantType: {
                relType: {
                  tag: 1,
                  primitiveType: 17,
                },
                value: {
                  arguments: [
                    {
                      tag: 17,
                      value: {
                        oneofKind: 'stringVal',
                        stringVal: new Uint8Array([
                          102,
                          111,
                          111,
                          59,
                          98,
                          97,
                          114,
                        ]),
                      },
                    },
                  ],
                },
              },
            },
            {
              tag: 1,
              primitiveType: 2,
            },
          ],
        },
      },
      {
        fileName: '2.arrow',
        relationId: {
          arguments: [
            {
              tag: 3,
              primitiveType: 0,
              constantType: {
                relType: {
                  tag: 1,
                  primitiveType: 17,
                },
                value: {
                  arguments: [
                    {
                      tag: 17,
                      value: {
                        oneofKind: 'stringVal',
                        stringVal: new Uint8Array([
                          111,
                          117,
                          116,
                          112,
                          117,
                          116,
                        ]),
                      },
                    },
                  ],
                },
              },
            },
            {
              tag: 1,
              primitiveType: 2,
            },
          ],
        },
      },
    ],
  },
};

describe('TransactionAsyncApi', () => {
  const api = new TransactionAsyncApi(getMockConfig());
  const mockTransactions = [
    { id: 'id1', state: TransactionAsyncState.COMPLETED },
    { id: 'id2', state: TransactionAsyncState.COMPLETED },
  ];
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should run async transaction', async () => {
    const query = '1 + 2 ';
    const response = mockTransactions[0];
    const payload = {
      dbname: database,
      engine_name: engine,
      query: query,
      nowait_durable: false,
      readonly: true,
      v1_inputs: [],
    };
    const scope = nock(baseUrl).post(path, payload).reply(200, response);
    const result = await api.runTransactionAsync(payload);

    scope.done();

    expect(result).toEqual({ transaction: mockTransactions[0] });
  });

  it('should run async transaction and parse results', async () => {
    const query = '1 + 2 ';
    const payload = {
      dbname: database,
      engine_name: engine,
      query: query,
      nowait_durable: false,
      readonly: true,
      v1_inputs: [],
    };
    const scope = nock(baseUrl).post(path, payload).reply(200, multipartMock, {
      'Content-type': multipartContentType,
    });
    const result = await api.runTransactionAsync(payload);

    scope.done();

    expect(result).toEqual(transactionAsyncMock);
  });

  it('should list transactions', async () => {
    const response = {
      transactions: mockTransactions,
    };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await api.listTransactions();

    scope.done();

    expect(result).toEqual(mockTransactions);
  });

  it('should list transactions with params', async () => {
    const response = {
      transactions: mockTransactions,
    };
    const query = {
      engine_name: 'test_engine',
      tags: ['tag1', 'tag2'],
    };
    const scope = nock(baseUrl).get(path).query(query).reply(200, response);
    const result = await api.listTransactions(query);

    scope.done();

    expect(result).toEqual(mockTransactions);
  });

  it('should get transaction', async () => {
    const response = {
      transaction: mockTransactions[0],
    };
    const scope = nock(baseUrl).get(`${path}/id1`).reply(200, response);
    const result = await api.getTransaction('id1');

    scope.done();

    expect(result).toEqual(mockTransactions[0]);
  });

  it('should get transaction results', async () => {
    const scope = nock(baseUrl)
      .get(`${path}/id1/results`)
      .reply(200, multipartMock, {
        'Content-type': multipartContentType,
      });
    const result = await api.getTransactionResults('id1');

    scope.done();

    expect(result).toEqual(transactionAsyncMock.results);
  });

  it('should get transaction metadata', async () => {
    const metadata = {
      relations: [
        {
          fileName: '0.arrow',
          relationId: {
            arguments: [
              {
                tag: 3,
                primitiveType: 0,
                constantType: {
                  relType: {
                    tag: 1,
                    primitiveType: 17,
                  },
                  value: {
                    arguments: [
                      {
                        tag: 17,
                        value: {
                          oneofKind: 'stringVal',
                          stringVal: new Uint8Array([
                            111,
                            117,
                            116,
                            112,
                            117,
                            116,
                          ]),
                        },
                      },
                    ],
                  },
                },
              },
              {
                tag: 3,
                primitiveType: 0,
                constantType: {
                  relType: {
                    tag: 1,
                    primitiveType: 17,
                  },
                  value: {
                    arguments: [
                      {
                        tag: 17,
                        value: {
                          oneofKind: 'stringVal',
                          stringVal: new Uint8Array([102, 111, 111]),
                        },
                      },
                    ],
                  },
                },
              },
              {
                tag: 1,
                primitiveType: 16,
              },
            ],
          },
        },
      ],
    };
    const scope = nock(baseUrl)
      .get(`${path}/id1/metadata`)
      .reply(200, protobufMock, {
        'Content-type': 'application/x-protobuf',
      });
    const result = await api.getTransactionMetadata('id1');

    scope.done();

    expect(result).toEqual(metadata);
  });

  it('should get transaction problems', async () => {
    const response = [
      {
        type: 'IntegrityConstraintViolation',
        sources: [],
      },
    ];
    const scope = nock(baseUrl)
      .get(`${path}/id1/problems`)
      .reply(200, response);
    const result = await api.getTransactionProblems('id1');

    scope.done();

    expect(result).toEqual(response);
  });

  it('should cancel transaction', async () => {
    const response = {};
    const scope = nock(baseUrl).post(`${path}/id1/cancel`).reply(200, response);
    const result = await api.cancelTransaction('id1');

    scope.done();

    expect(result).toEqual(response);
  });
});
