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

import { RelTypedValue } from './types';

type Test = {
  relType: string;
  type: RelTypedValue['type'];
  query: string;
  arrowValues: any[];
  values: RelTypedValue['value'][];
  displayValues: string[];
  places?: number;
  only?: boolean;
};

export const tests: Test[] = [
  {
    relType: 'String',
    type: 'String',
    query: `def output = "test"`,
    arrowValues: ['test'],
    values: ['test'],
    displayValues: ['test'],
  },
  {
    relType: 'Bool',
    type: 'Bool',
    query: `def output = boolean_true, boolean_false`,
    arrowValues: [true, false],
    values: [true, false],
    displayValues: ['true', 'false'],
  },
  {
    relType: 'Char',
    type: 'Char',
    query: `def output = 'a', '👍'`,
    arrowValues: [97, 128077],
    values: ['a', '👍'],
    displayValues: ['a', '👍'],
  },
  // TODO add other Time types
  {
    relType: 'Dates.DateTime',
    type: 'DateTime',
    query: `def output = 2021-10-12T01:22:31+10:00`,
    arrowValues: [63769648951000],
    values: [new Date('2021-10-11T15:22:31.000Z')],
    displayValues: ['2021-10-11T15:22:31.000Z'],
  },
  {
    relType: 'Dates.Date',
    type: 'Date',
    query: `def output = 2021-10-12`,
    arrowValues: [738075],
    values: [new Date('2021-10-12')],
    displayValues: ['2021-10-12'],
  },
  {
    relType: 'HashValue',
    type: 'Hash',
    query: `def output(x) = hash128["abc"](_, x)`,
    arrowValues: [[3877405323480549948n, 3198683864092244389n]],
    values: [59005302613613978016770438099762432572n],
    displayValues: ['59005302613613978016770438099762432572'],
  },
  {
    relType: 'Missing',
    type: 'Missing',
    query: `def output = missing`,
    arrowValues: [{}],
    values: [null],
    displayValues: ['missing'],
  },
  {
    relType: 'Int8',
    type: 'Int8',
    query: `def output = int[8, 12], int[8, -12]`,
    arrowValues: [12, -12],
    values: [12, -12],
    displayValues: ['12', '-12'],
  },
  {
    relType: 'Int16',
    type: 'Int16',
    query: `def output = int[16, 123], int[16, -123]`,
    arrowValues: [123, -123],
    values: [123, -123],
    displayValues: ['123', '-123'],
  },
  {
    relType: 'Int32',
    type: 'Int32',
    query: `def output = int[32, 1234], int[32, -1234]`,
    arrowValues: [1234, -1234],
    values: [1234, -1234],
    displayValues: ['1234', '-1234'],
  },
  {
    relType: 'Int64',
    type: 'Int64',
    query: `def output = 12345, -12345`,
    arrowValues: [12345n, -12345n],
    values: [12345n, -12345n],
    displayValues: ['12345', '-12345'],
  },
  {
    relType: 'Int128',
    type: 'Int128',
    query: `def output = 123456789101112131415, int[128, 0], int[128, -10^10]`,
    arrowValues: [
      [12776324658854821719n, 6n],
      [0n, 0n],
      [18446744063709551616n, 18446744073709551615n],
    ],
    values: [123456789101112131415n, 0n, -10000000000n],
    displayValues: ['123456789101112131415', '0', '-10000000000'],
  },
  {
    relType: 'UInt8',
    type: 'UInt8',
    query: `def output = uint[8, 12]`,
    arrowValues: [12],
    values: [12],
    displayValues: ['12'],
  },
  {
    relType: 'UInt16',
    type: 'UInt16',
    query: `def output = uint[16, 123]`,
    arrowValues: [123],
    values: [123],
    displayValues: ['123'],
  },
  {
    relType: 'UInt32',
    type: 'UInt32',
    query: `def output = uint[32, 1234]`,
    arrowValues: [1234],
    values: [1234],
    displayValues: ['1234'],
  },
  {
    relType: 'UInt64',
    type: 'UInt64',
    query: `def output = uint[64, 12345]`,
    arrowValues: [12345n],
    values: [12345n],
    displayValues: ['12345'],
  },
  {
    relType: 'UInt128',
    type: 'UInt128',
    query: `def output = uint[128, 123456789101112131415], uint[128, 0]`,
    arrowValues: [
      [12776324658854821719n, 6n],
      [0n, 0n],
    ],
    values: [123456789101112131415n, 0n],
    displayValues: ['123456789101112131415', '0'],
  },
  {
    relType: 'Float16',
    type: 'Float16',
    query: `def output = float[16, 12], float[16, 42.5]`,
    arrowValues: [12, 42.5],
    values: [12, 42.5],
    displayValues: ['12.0', '42.5'],
  },
  {
    relType: 'Float32',
    type: 'Float32',
    query: `def output = float[32, 12], float[32, 42.5]`,
    arrowValues: [12, 42.5],
    values: [12, 42.5],
    displayValues: ['12.0', '42.5'],
  },
  {
    relType: 'Float64',
    type: 'Float64',
    query: `def output = float[64, 12], float[64, 42.5]`,
    arrowValues: [12, 42.5],
    values: [12, 42.5],
    displayValues: ['12.0', '42.5'],
  },
  {
    relType: 'FixedPointDecimals.FixedDecimal{Int16, 2}',
    type: 'Decimal16',
    places: 2,
    query: `def output = parse_decimal[16, 2, "12.34"]`,
    arrowValues: [1234],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    relType: 'FixedPointDecimals.FixedDecimal{Int32, 2}',
    type: 'Decimal32',
    places: 2,
    query: `def output = parse_decimal[32, 2, "12.34"]`,
    arrowValues: [1234],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    relType: 'FixedPointDecimals.FixedDecimal{Int64, 2}',
    type: 'Decimal64',
    places: 2,
    query: `def output = parse_decimal[64, 2, "12.34"]`,
    arrowValues: [1234n],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    relType: 'FixedPointDecimals.FixedDecimal{Int128, 2}',
    type: 'Decimal128',
    places: 2,
    query: `def output = parse_decimal[128, 2, "12345678901011121314.34"]`,
    arrowValues: [[17082781236281724778n, 66n]],
    values: [new Decimal('12345678901011121314.34')],
    displayValues: ['12345678901011121314.34'],
  },
  {
    relType: 'Rational{Int8}',
    type: 'Rational8',
    query: `def output = rational[8, 1, 2]`,
    arrowValues: [[1, 2]],
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    relType: 'Rational{Int16}',
    type: 'Rational16',
    query: `def output = rational[16, 1, 2]`,
    arrowValues: [[1, 2]],
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    relType: 'Rational{Int32}',
    type: 'Rational32',
    query: `def output = rational[32, 1, 2]`,
    arrowValues: [[1, 2]],
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    relType: 'Rational{Int64}',
    type: 'Rational64',
    query: `def output = rational[64, 1, 2]`,
    arrowValues: [[1n, 2n]],
    values: [
      {
        numerator: 1n,
        denominator: 2n,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    relType: 'Rational{Int128}',
    type: 'Rational128',
    query: `def output = rational[128, 123456789101112313, 9123456789101112313]`,
    arrowValues: [
      [
        [123456789101112313n, 0n],
        [9123456789101112313n, 0n],
      ],
    ],
    values: [
      {
        numerator: 123456789101112313n,
        denominator: 9123456789101112313n,
      },
    ],
    displayValues: ['123456789101112313/9123456789101112313'],
  },
];
