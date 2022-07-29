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

import Client from '../api/client';
import {
  createDatabaseIfNotExists,
  createEngineIfNotExists,
  getClient,
} from '../testUtils';
import { ResultTable } from './resultTable';
import { tests } from './testData';

describe('Integration', () => {
  const databaseName = `js-sdk-tests-${Date.now()}`;
  const engineName = `js-sdk-tests-${Date.now()}`;
  // const databaseName = `js-sdk-tests-local`;
  // const engineName = `js-sdk-tests-local`;
  let client: Client;

  jest.setTimeout(1000 * 60 * 10);

  beforeAll(async () => {
    client = await getClient();

    await createEngineIfNotExists(client, engineName);
    await createDatabaseIfNotExists(client, databaseName);
  });

  afterAll(async () => {
    await client.deleteEngine(engineName);
    await client.deleteDatabase(databaseName);
  });

  describe('Rel to JS types', () => {
    // TODO add value types tests
    // TODO add specialization tests

    tests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(`should handle ${test.type} type`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]);
        const type = table.columnAt(0).typeDef.type;
        const values = table.get(0);

        expect(type).toEqual(test.type);
        expect(values).toEqual(test.values);
      });
    });
  });
});
