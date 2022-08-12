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

type Test = {
  name: string;
  typeDef: RelTypeDef;
  query: string;
  values: RelTypedValue['value'][];
  displayValues: string[];
  only?: boolean;
};

// This should cover all types from https://docs.relational.ai/rel/ref/data-types#overview

export const standardTypeTests: Test[] = [
  {
    name: 'String',
    typeDef: {
      type: 'String',
    },
    query: `def output = "test"`,
    values: ['test'],
    displayValues: ['test'],
  },
  {
    name: 'Bool',
    typeDef: {
      type: 'Bool',
    },
    query: `def output = boolean_true, boolean_false`,
    values: [true, false],
    displayValues: ['true', 'false'],
  },
  {
    name: 'Char',
    typeDef: {
      type: 'Char',
    },
    query: `def output = 'a', '👍'`,
    values: ['a', '👍'],
    displayValues: ['a', '👍'],
  },
  {
    name: 'DateTime',
    typeDef: {
      type: 'DateTime',
    },
    query: `def output = 2021-10-12T01:22:31+10:00`,
    values: [new Date('2021-10-11T15:22:31.000Z')],
    displayValues: ['2021-10-11T15:22:31.000Z'],
  },
  {
    name: 'Date',
    typeDef: {
      type: 'Date',
    },
    query: `def output = 2021-10-12`,
    values: [new Date('2021-10-12')],
    displayValues: ['2021-10-12'],
  },
  {
    name: 'Year',
    typeDef: {
      type: 'Year',
    },
    query: `def output = Year[2022]`,
    values: [2022n],
    displayValues: ['2022'],
  },
  {
    name: 'Month',
    typeDef: {
      type: 'Month',
    },
    query: `def output = Month[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Week',
    typeDef: {
      type: 'Week',
    },
    query: `def output = Week[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Day',
    typeDef: {
      type: 'Day',
    },
    query: `def output = Day[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hour',
    typeDef: {
      type: 'Hour',
    },
    query: `def output = Hour[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Minute',
    typeDef: {
      type: 'Minute',
    },
    query: `def output = Minute[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Second',
    typeDef: {
      type: 'Second',
    },
    query: `def output = Second[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Millisecond',
    typeDef: {
      type: 'Millisecond',
    },
    query: `def output = Millisecond[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Microsecond',
    typeDef: {
      type: 'Microsecond',
    },
    query: `def output = Microsecond[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Nanosecond',
    typeDef: {
      type: 'Nanosecond',
    },
    query: `def output = Nanosecond[1]`,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hash',
    typeDef: {
      type: 'Hash',
    },
    query: `
       entity type Foo = Int
       def output = ^Foo[12]
     `,
    values: [290925887971139297379988470542779955742n],
    displayValues: ['290925887971139297379988470542779955742'],
  },
  {
    name: 'Missing',
    typeDef: {
      type: 'Missing',
    },
    query: `def output = missing`,
    values: [null],
    displayValues: ['missing'],
  },
  {
    name: 'FilePos',
    typeDef: {
      type: 'FilePos',
    },
    query: `
     def config:data="""
     a,b,c
     1,2,3
     4,5,6
     """
     
     def csv = load_csv[config]
     
     def output(p) = csv(_, p, _)`,
    values: [2n],
    displayValues: ['2'],
  },
  {
    name: 'Int8',
    typeDef: {
      type: 'Int8',
    },
    query: `def output = int[8, 12], int[8, -12]`,
    values: [12, -12],
    displayValues: ['12', '-12'],
  },
  {
    name: 'Int16',
    typeDef: {
      type: 'Int16',
    },
    query: `def output = int[16, 123], int[16, -123]`,
    values: [123, -123],
    displayValues: ['123', '-123'],
  },
  {
    name: 'Int32',
    typeDef: {
      type: 'Int32',
    },
    query: `def output = int[32, 1234], int[32, -1234]`,
    values: [1234, -1234],
    displayValues: ['1234', '-1234'],
  },
  {
    name: 'Int64',
    typeDef: {
      type: 'Int64',
    },
    query: `def output = 12345, -12345`,
    values: [12345n, -12345n],
    displayValues: ['12345', '-12345'],
  },
  {
    name: 'Int128',
    typeDef: {
      type: 'Int128',
    },
    query: `def output = 123456789101112131415, int[128, 0], int[128, -10^10]`,
    values: [123456789101112131415n, 0n, -10000000000n],
    displayValues: ['123456789101112131415', '0', '-10000000000'],
  },
  {
    name: 'UInt8',
    typeDef: {
      type: 'UInt8',
    },
    query: `def output = uint[8, 12]`,
    values: [12],
    displayValues: ['12'],
  },
  {
    name: 'UInt16',
    typeDef: {
      type: 'UInt16',
    },
    query: `def output = uint[16, 123]`,
    values: [123],
    displayValues: ['123'],
  },
  {
    name: 'UInt32',
    typeDef: {
      type: 'UInt32',
    },
    query: `def output = uint[32, 1234]`,
    values: [1234],
    displayValues: ['1234'],
  },
  {
    name: 'UInt64',
    typeDef: {
      type: 'UInt64',
    },
    query: `def output = uint[64, 12345]`,
    values: [12345n],
    displayValues: ['12345'],
  },
  {
    name: 'UInt128',
    typeDef: {
      type: 'UInt128',
    },
    query: `def output = uint[128, 123456789101112131415], uint[128, 0], 0xdade49b564ec827d92f4fd30f1023a1e`,
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
    name: 'Float16',
    typeDef: {
      type: 'Float16',
    },
    query: `def output = float[16, 12], float[16, 42.5]`,
    values: [12, 42.5],
    displayValues: ['12.0', '42.5'],
  },
  {
    name: 'Float32',
    typeDef: {
      type: 'Float32',
    },
    query: `def output = float[32, 12], float[32, 42.5]`,
    values: [12, 42.5],
    displayValues: ['12.0', '42.5'],
  },
  {
    name: 'Float64',
    typeDef: {
      type: 'Float64',
    },
    query: `def output = float[64, 12], float[64, 42.5]`,
    values: [12, 42.5],
    displayValues: ['12.0', '42.5'],
  },
  {
    name: 'Decimal16',
    typeDef: {
      type: 'Decimal16',
      places: 2,
    },
    query: `def output = parse_decimal[16, 2, "12.34"]`,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal32',
    typeDef: {
      type: 'Decimal32',
      places: 2,
    },
    query: `def output = parse_decimal[32, 2, "12.34"]`,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal64',
    typeDef: {
      type: 'Decimal64',
      places: 2,
    },
    query: `def output = parse_decimal[64, 2, "12.34"]`,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal128',
    typeDef: {
      type: 'Decimal128',
      places: 2,
    },
    query: `def output = parse_decimal[128, 2, "12345678901011121314.34"]`,
    values: [new Decimal('12345678901011121314.34')],
    displayValues: ['12345678901011121314.34'],
  },
  {
    name: 'Rational8',
    typeDef: {
      type: 'Rational8',
    },
    query: `def output = rational[8, 1, 2]`,
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    name: 'Rational16',
    typeDef: {
      type: 'Rational16',
    },
    query: `def output = rational[16, 1, 2]`,
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    name: 'Rational32',
    typeDef: {
      type: 'Rational32',
    },
    query: `def output = rational[32, 1, 2]`,
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    name: 'Rational64',
    typeDef: {
      type: 'Rational64',
    },
    query: `def output = rational[64, 1, 2]`,
    values: [
      {
        numerator: 1n,
        denominator: 2n,
      },
    ],
    displayValues: ['1/2'],
  },
  {
    name: 'Rational128',
    typeDef: {
      type: 'Rational128',
    },
    query: `def output = rational[128, 123456789101112313, 9123456789101112313]`,
    values: [
      {
        numerator: 123456789101112313n,
        denominator: 9123456789101112313n,
      },
    ],
    displayValues: ['123456789101112313/9123456789101112313'],
  },
];

export const valueTypeTests: Test[] = [
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
    displayValues: ['123'],
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
    displayValues: ['123, abc'],
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
    displayValues: ['123445677777999999999'],
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
    displayValues: ['(123, inner), outer'],
  },
];

export const specializationTests: Test[] = [
  {
    name: 'String',
    typeDef: {
      type: 'Constant',
      name: 'Symbol',
      value: [
        {
          type: 'String',
          value: ':foo',
        },
      ],
    },
    query: `
       def output = :foo
     `,
    values: [':foo'],
    displayValues: [':foo'],
  },
  {
    name: 'Int8',
    typeDef: {
      type: 'Constant',
      name: 'Int8(3)',
      value: [
        {
          type: 'Int8',
          value: 3,
        },
      ],
    },
    query: `
       def v = int[8, 3]
       def output = #(v)
     `,
    values: [3],
    displayValues: ['3'],
  },
];
