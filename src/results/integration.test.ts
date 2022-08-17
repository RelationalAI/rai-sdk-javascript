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
import {
  miscValueTypeTests,
  specializationTests,
  standardTypeTests,
  valueTypeTests,
} from './tests';

describe('Integration', () => {
  const databaseName = `js-sdk-tests-${Date.now()}`;
  const engineName = `js-sdk-tests-${Date.now()}`;
  let client: Client;

  jest.setTimeout(1000 * 60 * 10);

  beforeAll(async () => {
    client = await getClient();

    await createEngineIfNotExists(client, engineName);
    await createDatabaseIfNotExists(client, databaseName);
  });

  describe('Rel to JS standard types', () => {
    standardTypeTests.forEach(test => {
      const testFn = test.skip ? it.skip : test.only ? it.only : it;

      testFn(`should handle ${test.name} type`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]).sliceColumns(1);
        const typeDef = table.columnAt(0).typeDef;
        const values = table.get(0);

        expect(typeDef).toEqual(test.typeDef);
        expect(values).toEqual(test.values);
      });
    });
  });

  describe('Rel to JS specialization', () => {
    specializationTests.forEach(test => {
      const testFn = test.skip ? it.skip : test.only ? it.only : it;

      testFn(`should handle ${test.name} specialization`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]).sliceColumns(1);
        const typeDef = table.columnAt(0).typeDef;
        const values = table.get(0);

        expect(typeDef).toEqual(test.typeDef);
        expect(values).toEqual(test.values);
      });
    });
  });

  describe('Rel to JS value types', () => {
    valueTypeTests.forEach(test => {
      const testFn = test.skip ? it.skip : test.only ? it.only : it;

      testFn(`should handle ${test.name} in value type`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]).sliceColumns(1);
        const typeDef = table.columnAt(0).typeDef;
        const values = table.get(0);

        expect(typeDef).toEqual(test.typeDef);
        expect(values).toEqual(test.values);
      });
    });
  });

  describe('Rel to JS value types misc', () => {
    miscValueTypeTests.forEach(test => {
      const testFn = test.skip ? it.skip : test.only ? it.only : it;

      testFn(`should handle ${test.name} value type`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]).sliceColumns(1);
        const typeDef = table.columnAt(0).typeDef;
        const values = table.get(0);

        expect(typeDef).toEqual(test.typeDef);
        expect(values).toEqual(test.values);
      });
    });
  });
});
