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
import { readConfig } from '../config';
import {
  createDatabaseIfNotExists,
  createEngineIfNotExists,
} from '../testUtils';
import { ResultTable } from './resultTable';

describe('ResultTable', () => {
  describe('Types', () => {
    const databaseName = `js-sdk-tests`;
    const engineName = `js-sdk-tests-local`;
    // const engineName = `js-sdk-tests-${Date.now()}`;
    let client: Client;

    beforeAll(async () => {
      jest.setTimeout(1000 * 60 * 10);

      const config = await readConfig();

      client = new Client(config);

      await createEngineIfNotExists(client, engineName);
      await createDatabaseIfNotExists(client, databaseName);
    });

    // afterEach(async () => {
    //   await client.deleteEngine(engineName);
    //   await client.deleteDatabase(databaseName);
    // });

    const tests = [
      {
        name: 'should handle String type',
        query: `def output = "test"`,
        expectedValues: [{ column0: 'test' }],
        expectedDisplayValues: [{ column0: 'test' }],
        only: false,
      },
      {
        name: 'should handle Bool type',
        query: `def output = boolean_true, boolean_false`,
        expectedValues: [{ column0: true, column1: false }],
        expectedDisplayValues: [{ column0: 'true', column1: 'false' }],
        only: false,
      },
      {
        name: 'should handle Char type',
        query: `def output = 'a', '👍'`,
        expectedValues: [{ column0: 'a', column1: '👍' }],
        expectedDisplayValues: [{ column0: 'a', column1: '👍' }],
        only: false,
      },
      {
        name: 'should handle Dates.DateTime type',
        query: `def output = 2021-10-12T01:22:31+10:00`,
        expectedValues: [{ column0: new Date('2021-10-11T15:22:31.000Z') }],
        expectedDisplayValues: [{ column0: '2021-10-11T15:22:31.000Z' }],
        only: false,
      },
      {
        name: 'should handle Dates.Date type',
        query: `def output = 2021-10-12`,
        expectedValues: [{ column0: new Date('2021-10-12') }],
        expectedDisplayValues: [{ column0: '2021-10-12' }],
        only: false,
      },
      {
        name: 'should handle HashValue type',
        query: `def output = hash128["abc"]`,
        expectedValues: [
          { column0: 'abc', column1: 59005302613613978016770438099762432572n },
        ],
        expectedDisplayValues: [
          {
            column0: 'abc',
            column1: '59005302613613978016770438099762432572',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Missing type',
        query: `def output = missing`,
        expectedValues: [{ column0: null }],
        expectedDisplayValues: [
          {
            column0: 'missing',
          },
        ],
        only: false,
      },
    ];

    tests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(test.name, async () => {
        const result = await client.exec(databaseName, engineName, test.query);
        const resultTable = new ResultTable(result.results[0]);

        const values = resultTable.toJS('value');
        const displayValues = resultTable.toJS('displayValue');

        expect(values).toEqual(test.expectedValues);
        expect(displayValues).toEqual(test.expectedDisplayValues);
      });
    });
  });
});
