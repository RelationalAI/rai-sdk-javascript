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
import { ExecAsyncApi } from './execAsyncApi';

const path = '/transactions';

describe('QueryAsyncApi', () => {
  const api = new ExecAsyncApi(getMockConfig());
  const mockTransaction = {
    transaction: { id: 'id1', state: TransactionAsyncState.COMPLETED },
  };
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should exec query async', async () => {
    const query = '1 + 2 ';
    const response = mockTransaction.transaction;
    const scope = nock(baseUrl)
      .post(path, {
        dbname: database,
        engine_name: engine,
        query: query,
        nowait_durable: false,
        readonly: true,
        inputs: [],
      })
      .reply(200, response);
    const result = await api.execAsync(database, engine, query, [], true);

    scope.done();

    expect(result).toEqual(mockTransaction);
  });
});
