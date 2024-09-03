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

import {
  createDatabaseIfNotExists,
  getClient,
  getEngineName,
} from '../../testUtils';
import Client from '../client';
import { Model } from '../transaction/types';

describe('ModelApi', () => {
  const databaseName = `js-sdk-tests-${Date.now()}`;
  const engineName = getEngineName();
  let client: Client;

  beforeAll(async () => {
    client = await getClient();

    await createDatabaseIfNotExists(client, databaseName);
  });

  afterAll(async () => {
    await client.deleteDatabase(databaseName);
  });

  describe('Models actions', () => {
    it('should listModels', async () => {
      const models = await client.listModels(databaseName, engineName);
      expect(models?.length).toBeGreaterThan(0);
    });

    it('should installModel', async () => {
      const testModels: Model[] = [
        { name: 'test_model_1', value: 'def foo {:bar}' },
      ];
      const resp = await client.installModels(
        databaseName,
        engineName,
        testModels,
      );
      expect(resp.transaction.state).toEqual('COMPLETED');

      const model = await client.getModel(
        databaseName,
        engineName,
        'test_model_1',
      );
      expect(model.name).toEqual('test_model_1');
      expect(model.value).toEqual(testModels[0].value);

      const models = await client.listModels(databaseName, engineName);
      expect(models).toContain('test_model_1');
    });

    it('should deleteModel', async () => {
      const testModels: Model[] = [
        { name: 'test_model_2', value: 'def foo {:bar}' },
      ];
      let resp = await client.installModels(
        databaseName,
        engineName,
        testModels,
      );
      expect(resp.transaction.state).toEqual('COMPLETED');
      resp = await client.deleteModels(databaseName, engineName, [
        'test_model_2',
      ]);
      expect(resp.transaction.state).toEqual('COMPLETED');

      const models = await client.listModels(databaseName, engineName);
      expect(models).not.toContain('test_model_2');
    });
  });
});
