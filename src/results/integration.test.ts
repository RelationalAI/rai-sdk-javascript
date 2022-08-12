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
import { specializationTests, tests, valueTypeTests } from './testData';

describe.only('Integration', () => {
  // const databaseName = `js-sdk-tests-${Date.now()}`;
  // const engineName = `js-sdk-tests-${Date.now()}`;
  const databaseName = `js-sdk-tests-local`;
  const engineName = `js-sdk-tests-local`;
  let client: Client;

  jest.setTimeout(1000 * 60 * 10);

  beforeAll(async () => {
    client = await getClient();

    await createEngineIfNotExists(client, engineName);
    await createDatabaseIfNotExists(client, databaseName);
  });

  // afterAll(async () => {
  //   await client.deleteEngine(engineName);
  //   await client.deleteDatabase(databaseName);
  // });

  // it.only(`should handle`, async () => {
  //   // const query = `
  //   // value type MyType = SignedInt[128], String
  //   // def output = ^MyType[12344567777799999999, "abc"]
  //   // `;
  //   const query = `
  //   def output = :"Country Subject Descriptor Units Scale Country/Series-specific Notes", 1
  //   `;
  //   // const query = `
  //   // value type NestedTwo = Int, String
  //   // value type NestedOne = NestedTwo, Int
  //   // value type MyType = NestedOne, Int
  //   // def output = ^MyType[^NestedOne[^NestedTwo[888, "b"], 999], 101010]
  //   // `;
  //   // const query = `
  //   // def decml = parse_decimal[128, 2, "123123123123123123213.85"]
  //   // def output = decml
  //   // `;
  //   // const query = `
  //   // value type MyType = Int, String, Date
  //   // def a = ^MyType[123, "abc", 2021-10-12]
  //   // def output = a
  //   // `;
  //   // const query = `
  //   // value type MyType = Int, String, Date
  //   // def a = ^MyType[123123123123123123213, "abc", 2021-10-12]
  //   // def output = a
  //   // `;
  //   const result = await client.exec(databaseName, engineName, query);
  //   debugger;
  //   const table = new ResultTable(result.results[0]).sliceColumns(1);

  //   table.print();

  //   console.log('values', table.values());
  // });

  describe('Rel to JS standard types', () => {
    tests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(`should handle ${test.type} type`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]).sliceColumns(1);
        const type = table.columnAt(0).typeDef.type;
        const values = table.get(0);

        expect(type).toEqual(test.type);
        expect(values).toEqual(test.values);
      });
    });
  });

  describe('Rel to JS value types', () => {
    valueTypeTests.forEach(test => {
      const testFn = test.only ? it.only : it;

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

  describe('Rel to JS specialization', () => {
    specializationTests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(`should handle ${test.name} specialization`, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const table = new ResultTable(result.results[0]).sliceColumns(1);
        const typeDef = table.columnAt(0).typeDef;
        const values = table.get(0);

        table.print();

        expect(typeDef).toEqual(test.typeDef);
        expect(values).toEqual(test.values);
      });
    });
  });
});
