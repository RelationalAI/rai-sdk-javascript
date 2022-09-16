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

import { baseUrl, getMockConfig } from '../../testUtils';
import { TransactionAsyncState } from '../transaction/types';
import { ModelApi } from './modelApi';

const path = '/transactions';

describe('ModelApi', () => {
  const api = new ModelApi(getMockConfig());
  const mockTransaction = {
    transaction: { id: 'id1', state: TransactionAsyncState.COMPLETED },
  };

  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should insert models', async () => {
    const response = mockTransaction.transaction;
    const models = [{ name: 'test1', value: 'def foo = :bar', type: 'rel' }];
    const payload = {
      dbname: database,
      engine_name: engine,
      query: 'def insert:rel:catalog:model["test1"] = "def foo = :bar"',
      nowait_durable: false,
      readonly: true,
      v1_inputs: [],
      tags: [],
    };

    const scope = nock(baseUrl).post(path, payload).reply(200, response);
    const result = api.installModels(database, engine, models, true);

    scope.done();

    expect(result).toEqual(response);
  });

  it('should delete model', async () => {
    const response = mockTransaction.transaction;
    const payload = {
      dbname: database,
      engine_name: engine,
      query:
        'def delete:rel:catalog:model["test1"] = rel:catalog:model["test1"]',
      nowait_durable: false,
      readonly: true,
      v1_inputs: [],
      tags: [],
    };

    const scope = nock(baseUrl).post(path, payload).reply(200, response);
    const result = api.deleteModel(database, engine, 'test1', true);

    scope.done();

    expect(result).toEqual(response);
  });
});
