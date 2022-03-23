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

import nock from 'nock';

import { baseUrl, getMockConfig } from '../testUtils';
import { TransactionAsyncState } from '../transaction/types';
import { TransactionAsyncApi } from './transactionAsyncApi';

const path = '/transactions';

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
      inputs: [],
    };
    const scope = nock(baseUrl).post(path, payload).reply(200, response);
    const result = await api.runTransactionAsync(payload);

    scope.done();

    expect(result).toEqual(mockTransactions[0]);
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

  // TODO
  it.skip('should get transaction results', async () => {
    const response = {
      transaction: mockTransactions[0],
    };
    const scope = nock(baseUrl).get(`${path}/id1`).reply(200, response);
    const result = await api.getTransactionResults('id1');

    scope.done();

    expect(result).toEqual(mockTransactions[0]);
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

  it('should delete transaction', async () => {
    const response = { txn_id: 'id1', message: 'deleted' };
    const scope = nock(baseUrl).delete(`${path}/id1`).reply(200, response);
    const result = await api.deleteTransaction('id1');

    scope.done();

    expect(result).toEqual(response);
  });
});
