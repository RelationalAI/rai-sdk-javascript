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

import { baseUrl, getMockConfig } from '../testUtils';
import { TransactionAsyncState } from '../transaction/types';
import { TransactionAsyncApi } from './transactionAsyncApi';

const path = '/transactions';

const multipartMock = readFileSync(__dirname + '/multipartMock');
const multipartContentType =
  'multipart/form-data; boundary=fbef11dbaedd10b55d8af920ba13dd4f9e03cbddbe52c3d12e8c2eb56a23';
const transactionAsyncMock = {
  transaction: {
    id: '59b04616-887d-40aa-b003-f310eb573557',
    state: 'COMPLETED',
    response_format_version: '2.0.1',
  },
  problems: [],
  metadata: [
    { relationId: '/:output/:foo', types: [':output', ':foo'] },
    {
      relationId: '/:output/:foo;bar/Int64',
      types: [':output', ':foo;bar', 'Int64'],
    },
    { relationId: '/:output/Int64', types: [':output', 'Int64'] },
  ],
  results: [
    { relationId: '/:output/:foo', table: expect.anything() },
    { relationId: '/:output/:foo;bar/Int64', table: expect.anything() },
    { relationId: '/:output/Int64', table: expect.anything() },
  ],
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
    const response = [
      {
        relationId: 'foo',
        types: ['bar'],
      },
    ];
    const scope = nock(baseUrl)
      .get(`${path}/id1/metadata`)
      .reply(200, response);
    const result = await api.getTransactionMetadata('id1');

    scope.done();

    expect(result).toEqual(response);
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

  it('should delete transaction', async () => {
    const response = { txn_id: 'id1', message: 'deleted' };
    const scope = nock(baseUrl).delete(`${path}/id1`).reply(200, response);
    const result = await api.deleteTransaction('id1');

    scope.done();

    expect(result).toEqual(response);
  });
});
