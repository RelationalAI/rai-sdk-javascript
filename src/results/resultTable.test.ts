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

import Decimal from 'decimal.js';

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
      // TODO add other Time types
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
      {
        name: 'should handle Int8 type',
        query: `def output = int[8, 12], int[8, -12]`,
        expectedValues: [{ column0: 12, column1: -12 }],
        expectedDisplayValues: [
          {
            column0: '12',
            column1: '-12',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Int16 type',
        query: `def output = int[16, 123], int[16, -123]`,
        expectedValues: [{ column0: 123, column1: -123 }],
        expectedDisplayValues: [
          {
            column0: '123',
            column1: '-123',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Int32 type',
        query: `def output = int[32, 1234], int[32, -1234]`,
        expectedValues: [{ column0: 1234, column1: -1234 }],
        expectedDisplayValues: [
          {
            column0: '1234',
            column1: '-1234',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Int64 type',
        query: `def output = 12345, -12345`,
        expectedValues: [{ column0: 12345n, column1: -12345n }],
        expectedDisplayValues: [
          {
            column0: '12345',
            column1: '-12345',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Int128 type',
        query: `def output = 123456789101112131415, int[128, 0], int[128, -10^10]`,
        expectedValues: [
          {
            column0: 123456789101112131415n,
            column1: 0n,
            column2: -10000000000n,
          },
        ],
        expectedDisplayValues: [
          {
            column0: '123456789101112131415',
            column1: '0',
            column2: '-10000000000',
          },
        ],
        only: false,
      },

      {
        name: 'should handle UInt8 type',
        query: `def output = uint[8, 12]`,
        expectedValues: [{ column0: 12 }],
        expectedDisplayValues: [
          {
            column0: '12',
          },
        ],
        only: false,
      },
      {
        name: 'should handle UInt16 type',
        query: `def output = uint[16, 123]`,
        expectedValues: [{ column0: 123 }],
        expectedDisplayValues: [
          {
            column0: '123',
          },
        ],
        only: false,
      },
      {
        name: 'should handle UInt32 type',
        query: `def output = uint[32, 1234]`,
        expectedValues: [{ column0: 1234 }],
        expectedDisplayValues: [
          {
            column0: '1234',
          },
        ],
        only: false,
      },
      {
        name: 'should handle UInt64 type',
        query: `def output = uint[64, 12345]`,
        expectedValues: [{ column0: 12345n }],
        expectedDisplayValues: [
          {
            column0: '12345',
          },
        ],
        only: false,
      },
      {
        name: 'should handle UInt128 type',
        query: `def output = uint[128, 123456789101112131415], uint[128, 0]`,
        expectedValues: [
          {
            column0: 123456789101112131415n,
            column1: 0n,
          },
        ],
        expectedDisplayValues: [
          {
            column0: '123456789101112131415',
            column1: '0',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Float16 type',
        query: `def output = float[16, 12], float[16, 42.5]`,
        expectedValues: [
          {
            column0: 12,
            column1: 42.5,
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12.0',
            column1: '42.5',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Float32 type',
        query: `def output = float[32, 12], float[32, 42.5]`,
        expectedValues: [
          {
            column0: 12,
            column1: 42.5,
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12.0',
            column1: '42.5',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Float64 type',
        query: `def output = float[64, 12], float[64, 42.5]`,
        expectedValues: [
          {
            column0: 12,
            column1: 42.5,
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12.0',
            column1: '42.5',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Decimal16 type',
        query: `def output = parse_decimal[16, 2, "12.34"]`,
        expectedValues: [
          {
            column0: new Decimal('12.34'),
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12.34',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Decimal32 type',
        query: `def output = parse_decimal[32, 2, "12.34"]`,
        expectedValues: [
          {
            column0: new Decimal('12.34'),
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12.34',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Decimal64 type',
        query: `def output = parse_decimal[64, 2, "12.34"]`,
        expectedValues: [
          {
            column0: new Decimal('12.34'),
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12.34',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Decimal128 type',
        query: `def output = parse_decimal[128, 2, "12345678901011121314.34"]`,
        expectedValues: [
          {
            column0: new Decimal('12345678901011121314.34'),
          },
        ],
        expectedDisplayValues: [
          {
            column0: '12345678901011121314.34',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Rational8 type',
        query: `def output = rational[8, 1, 2]`,
        expectedValues: [
          {
            column0: {
              numerator: 1,
              denominator: 2,
            },
          },
        ],
        expectedDisplayValues: [
          {
            column0: '1/2',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Rational16 type',
        query: `def output = rational[16, 1, 2]`,
        expectedValues: [
          {
            column0: {
              numerator: 1,
              denominator: 2,
            },
          },
        ],
        expectedDisplayValues: [
          {
            column0: '1/2',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Rational32 type',
        query: `def output = rational[32, 1, 2]`,
        expectedValues: [
          {
            column0: {
              numerator: 1,
              denominator: 2,
            },
          },
        ],
        expectedDisplayValues: [
          {
            column0: '1/2',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Rational64 type',
        query: `def output = rational[64, 1, 2]`,
        expectedValues: [
          {
            column0: {
              numerator: 1n,
              denominator: 2n,
            },
          },
        ],
        expectedDisplayValues: [
          {
            column0: '1/2',
          },
        ],
        only: false,
      },
      {
        name: 'should handle Rational128 type',
        query: `def output = rational[128, 123456789101112313, 9123456789101112313]`,
        expectedValues: [
          {
            column0: {
              numerator: 123456789101112313n,
              denominator: 9123456789101112313n,
            },
          },
        ],
        expectedDisplayValues: [
          {
            column0: '123456789101112313/9123456789101112313',
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

  // TODO add value types tests
  // TODO add specialization tests
});
