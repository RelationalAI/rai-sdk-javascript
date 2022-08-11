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

import { RelTypeDef, RelTypedValue } from './types';

type RelStandardTypeTest = {
  relType: string;
  type: RelTypedValue['type'];
  query: string;
  arrowValues: any[];
  values: RelTypedValue['value'][];
  displayValues: string[];
  places?: number;
  only?: boolean;
};

// This should cover all types from https://docs.relational.ai/rel/ref/data-types#overview

export const tests: RelStandardTypeTest[] = [
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
    relType: 'Dates.Year',
    type: 'Year',
    query: `def output = Year[2022]`,
    arrowValues: [2022n],
    values: [2022n],
    displayValues: ['2022'],
  },
  {
    relType: 'Dates.Month',
    type: 'Month',
    query: `def output = Month[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Week',
    type: 'Week',
    query: `def output = Week[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Day',
    type: 'Day',
    query: `def output = Day[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Hour',
    type: 'Hour',
    query: `def output = Hour[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Minute',
    type: 'Minute',
    query: `def output = Minute[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Second',
    type: 'Second',
    query: `def output = Second[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Millisecond',
    type: 'Millisecond',
    query: `def output = Millisecond[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Microsecond',
    type: 'Microsecond',
    query: `def output = Microsecond[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'Dates.Nanosecond',
    type: 'Nanosecond',
    query: `def output = Nanosecond[1]`,
    arrowValues: [1n],
    values: [1n],
    displayValues: ['1'],
  },
  {
    relType: 'HashValue',
    type: 'Hash',
    query: `
      entity type Foo = Int
      def output = ^Foo[12]
    `,
    arrowValues: [[10589367010498591262n, 15771123988529185405n]],
    values: [290925887971139297379988470542779955742n],
    displayValues: ['290925887971139297379988470542779955742'],
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
    relType: 'FilePos',
    type: 'FilePos',
    query: `
    def config:data="""
    a,b,c
    1,2,3
    4,5,6
    """
    
    def csv = load_csv[config]
    
    def output(p) = csv(_, p, _)`,
    arrowValues: [2n],
    values: [2n],
    displayValues: ['2'],
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
    query: `def output = uint[128, 123456789101112131415], uint[128, 0], 0xdade49b564ec827d92f4fd30f1023a1e`,
    arrowValues: [
      [12776324658854821719n, 6n],
      [0n, 0n],
      [10589367010498591262n, 15771123988529185405n],
    ],
    values: [
      123456789101112131415n,
      0n,
      290925887971139297379988470542779955742n,
    ],
    displayValues: [
      '123456789101112131415',
      '0',
      '290925887971139297379988470542779955742',
    ],
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

type RelValueTypeTest = {
  name: string;
  typeDef: RelTypeDef;
  query: string;
  values: RelTypedValue['value'][];
  only?: boolean;
};

export const valueTypeTests: RelValueTypeTest[] = [
  {
    name: 'Int',
    typeDef: {
      type: 'ValueType',
      typeDefs: [
        {
          type: 'Constant',
          name: 'Symbol',
          value: [{ type: 'String', value: ':MyType' }],
        },
        {
          type: 'Int64',
        },
      ],
    },
    query: `
      value type MyType = Int
      def output = ^MyType[123]
    `,
    values: [[123n]],
  },
  {
    name: 'Int, String',
    typeDef: {
      type: 'ValueType',
      typeDefs: [
        {
          type: 'Constant',
          name: 'Symbol',
          value: [{ type: 'String', value: ':MyType' }],
        },
        {
          type: 'Int64',
        },
        {
          type: 'String',
        },
      ],
    },
    query: `
      value type MyType = Int, String
      def output = ^MyType[123, "abc"]
    `,
    values: [[123n, 'abc']],
  },
  {
    name: 'Int128',
    typeDef: {
      type: 'ValueType',
      typeDefs: [
        {
          type: 'Constant',
          name: 'Symbol',
          value: [{ type: 'String', value: ':MyType' }],
        },
        {
          type: 'Int128',
        },
      ],
    },
    query: `
      value type MyType = SignedInt[128]
      def output = ^MyType[123445677777999999999]
    `,
    values: [[123445677777999999999n]],
  },
  {
    name: 'OuterType(InnerType(Int, String), String)',
    typeDef: {
      type: 'ValueType',
      typeDefs: [
        {
          type: 'Constant',
          name: 'Symbol',
          value: [{ type: 'String', value: ':OuterType' }],
        },
        {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              name: 'Symbol',
              value: [{ type: 'String', value: ':InnerType' }],
            },
            {
              type: 'Int64',
            },
            {
              type: 'String',
            },
          ],
        },
        {
          type: 'String',
        },
      ],
    },
    query: `
      value type InnerType = Int, String
      value type OuterType = InnerType, String
      def output = ^OuterType[^InnerType[123, "inner"], "outer"]
    `,
    values: [[[123n, 'inner'], 'outer']],
  },
];
