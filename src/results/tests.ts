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
  typeDefs: RelTypeDef[];
  query: string;
  values: RelTypedValue['value'][];
  displayValues: string[];
  only?: boolean;
  skip?: boolean;
};

// This should cover all types from https://docs.relational.ai/rel/ref/data-types#overview

export const standardTypeTests: Test[] = [
  {
    name: 'String',
    query: `
      def s1 = "_\\"escape test1\\"_"
      def s2 = "_\\\\escape test2\\\\_"
      def output = s1, s2
    `,
    typeDefs: [
      {
        type: 'String',
      },
      {
        type: 'String',
      },
    ],
    values: ['_"escape test1"_', '_\\escape test2\\_'],
    displayValues: ['"_\\"escape test1\\"_"', '"_\\\\escape test2\\\\_"'],
  },
  {
    name: 'Bool',
    query: `def output = boolean_true, boolean_false`,
    typeDefs: [
      {
        type: 'Bool',
      },
      {
        type: 'Bool',
      },
    ],
    values: [true, false],
    displayValues: ['true', 'false'],
  },
  {
    name: 'Char',
    query: `def output = 'a', '👍'`,
    typeDefs: [
      {
        type: 'Char',
      },
      {
        type: 'Char',
      },
    ],
    values: ['a', '👍'],
    displayValues: ["'a'", "'👍'"],
  },
  {
    name: 'DateTime',
    query: `def output = 2021-10-12T01:22:31+10:00`,
    typeDefs: [
      {
        type: 'DateTime',
      },
    ],
    values: [new Date('2021-10-11T15:22:31.000Z')],
    displayValues: ['2021-10-11T15:22:31.000Z'],
  },
  {
    name: 'Date',
    query: `def output = 2021-10-12`,
    typeDefs: [
      {
        type: 'Date',
      },
    ],
    values: [new Date('2021-10-12')],
    displayValues: ['2021-10-12'],
  },
  {
    name: 'Year',
    query: `def output = Year[2022]`,
    typeDefs: [
      {
        type: 'Year',
      },
    ],
    values: [2022n],
    displayValues: ['2022'],
  },
  {
    name: 'Month',
    query: `def output = Month[1]`,
    typeDefs: [
      {
        type: 'Month',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Week',
    query: `def output = Week[1]`,
    typeDefs: [
      {
        type: 'Week',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Day',
    query: `def output = Day[1]`,
    typeDefs: [
      {
        type: 'Day',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hour',
    query: `def output = Hour[1]`,
    typeDefs: [
      {
        type: 'Hour',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Minute',
    query: `def output = Minute[1]`,
    typeDefs: [
      {
        type: 'Minute',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Second',
    query: `def output = Second[1]`,
    typeDefs: [
      {
        type: 'Second',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Millisecond',
    query: `def output = Millisecond[1]`,
    typeDefs: [
      {
        type: 'Millisecond',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Microsecond',
    query: `def output = Microsecond[1]`,
    typeDefs: [
      {
        type: 'Microsecond',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Nanosecond',
    query: `def output = Nanosecond[1]`,
    typeDefs: [
      {
        type: 'Nanosecond',
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hash',
    query: `
       entity type Foo = Int
       def output = ^Foo[12]
     `,
    typeDefs: [
      {
        type: 'Hash',
      },
    ],
    values: [290925887971139297379988470542779955742n],
    displayValues: ['290925887971139297379988470542779955742'],
  },
  {
    name: 'Missing',
    query: `def output = missing`,
    typeDefs: [
      {
        type: 'Missing',
      },
    ],
    values: [null],
    displayValues: ['missing'],
  },
  {
    name: 'FilePos',
    query: `
      def config:data="""
      a,b,c
      1,2,3
      4,5,6
      """
      
      def csv = load_csv[config]
      
      def output(p) = csv(_, p, _)
    `,
    typeDefs: [
      {
        type: 'FilePos',
      },
    ],
    values: [2n],
    displayValues: ['2'],
  },
  {
    name: 'Int8',
    query: `def output = int[8, 12], int[8, -12]`,
    typeDefs: [
      {
        type: 'Int8',
      },
      {
        type: 'Int8',
      },
    ],
    values: [12, -12],
    displayValues: ['12', '-12'],
  },
  {
    name: 'Int16',
    query: `def output = int[16, 123], int[16, -123]`,
    typeDefs: [
      {
        type: 'Int16',
      },
      {
        type: 'Int16',
      },
    ],
    values: [123, -123],
    displayValues: ['123', '-123'],
  },
  {
    name: 'Int32',
    query: `def output = int[32, 1234], int[32, -1234]`,
    typeDefs: [
      {
        type: 'Int32',
      },
      {
        type: 'Int32',
      },
    ],
    values: [1234, -1234],
    displayValues: ['1234', '-1234'],
  },
  {
    name: 'Int64',
    query: `def output = 12345, -12345`,
    typeDefs: [
      {
        type: 'Int64',
      },
      {
        type: 'Int64',
      },
    ],
    values: [12345n, -12345n],
    displayValues: ['12345', '-12345'],
  },
  {
    name: 'Int128',
    query: `def output = 123456789101112131415, int[128, 0], int[128, -10^10]`,
    typeDefs: [
      {
        type: 'Int128',
      },
      {
        type: 'Int128',
      },
      {
        type: 'Int128',
      },
    ],
    values: [123456789101112131415n, 0n, -10000000000n],
    displayValues: ['123456789101112131415', '0', '-10000000000'],
  },
  {
    name: 'UInt8',
    query: `def output = uint[8, 12]`,
    typeDefs: [
      {
        type: 'UInt8',
      },
    ],
    values: [12],
    displayValues: ['12'],
  },
  {
    name: 'UInt16',
    query: `def output = uint[16, 123]`,
    typeDefs: [
      {
        type: 'UInt16',
      },
    ],
    values: [123],
    displayValues: ['123'],
  },
  {
    name: 'UInt32',
    query: `def output = uint[32, 1234]`,
    typeDefs: [
      {
        type: 'UInt32',
      },
    ],
    values: [1234],
    displayValues: ['1234'],
  },
  {
    name: 'UInt64',
    query: `def output = uint[64, 12345]`,
    typeDefs: [
      {
        type: 'UInt64',
      },
    ],
    values: [12345n],
    displayValues: ['12345'],
  },
  {
    name: 'UInt128',
    query: `def output = uint[128, 123456789101112131415], uint[128, 0], 0xdade49b564ec827d92f4fd30f1023a1e`,
    typeDefs: [
      {
        type: 'UInt128',
      },
      {
        type: 'UInt128',
      },
      {
        type: 'UInt128',
      },
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
    name: 'Float16',
    query: `def output = float[16, 12], float[16, 42.5], float[16, -0.0]`,
    typeDefs: [
      {
        type: 'Float16',
      },
      {
        type: 'Float16',
      },
      {
        type: 'Float16',
      },
    ],
    values: [12, 42.5, -0],
    displayValues: ['12.0', '42.5', '-0.0'],
  },
  {
    name: 'Float32',
    query: `def output = float[32, 12], float[32, 42.5], float[32, -0.0]`,
    typeDefs: [
      {
        type: 'Float32',
      },
      {
        type: 'Float32',
      },
      {
        type: 'Float32',
      },
    ],
    values: [12, 42.5, -0],
    displayValues: ['12.0', '42.5', '-0.0'],
  },
  {
    name: 'Float64',
    query: `def output = float[64, 12], float[64, 42.5], float[64, -0.0]`,
    typeDefs: [
      {
        type: 'Float64',
      },
      {
        type: 'Float64',
      },
      {
        type: 'Float64',
      },
    ],
    values: [12, 42.5, -0],
    displayValues: ['12.0', '42.5', '-0.0'],
  },
  {
    name: 'Decimal16',
    query: `def output = parse_decimal[16, 2, "12.34"]`,
    typeDefs: [
      {
        type: 'Decimal16',
        places: 2,
      },
    ],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal32',
    query: `def output = parse_decimal[32, 2, "12.34"]`,
    typeDefs: [
      {
        type: 'Decimal32',
        places: 2,
      },
    ],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal64',
    query: `def output = parse_decimal[64, 2, "12.34"]`,
    typeDefs: [
      {
        type: 'Decimal64',
        places: 2,
      },
    ],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal128',
    query: `def output = parse_decimal[128, 2, "123456789010111213141516171819202122.34"]`,
    typeDefs: [
      {
        type: 'Decimal128',
        places: 2,
      },
    ],
    values: [new Decimal('123456789010111213141516171819202122.34')],
    displayValues: ['123456789010111213141516171819202122.34'],
  },
  {
    name: 'Rational8',
    query: `def output = rational[8, 1, 2]`,
    typeDefs: [
      {
        type: 'Rational8',
      },
    ],
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
    query: `def output = rational[16, 1, 2]`,
    typeDefs: [
      {
        type: 'Rational16',
      },
    ],
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
    query: `def output = rational[32, 1, 2]`,
    typeDefs: [
      {
        type: 'Rational32',
      },
    ],
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
    query: `def output = rational[64, 1, 2]`,
    typeDefs: [
      {
        type: 'Rational64',
      },
    ],
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
    query: `def output = rational[128, 123456789101112313, 9123456789101112313]`,
    typeDefs: [
      {
        type: 'Rational128',
      },
    ],
    values: [
      {
        numerator: 123456789101112313n,
        denominator: 9123456789101112313n,
      },
    ],
    displayValues: ['123456789101112313/9123456789101112313'],
  },
  {
    name: 'UUID',
    query: `
      with rel:base use uuid_from_string
      def output = uuid_from_string["22b4a8a1-e548-4eeb-9270-60426d66a48e"]
    `,
    typeDefs: [
      {
        type: 'UUID',
      },
    ],
    values: ['22b4a8a1-e548-4eeb-9270-60426d66a48e'],
    displayValues: ['"22b4a8a1-e548-4eeb-9270-60426d66a48e"'],
  },
  {
    name: 'SHA1',
    query: `
      with rel:base use ^SHA1
      def output = ^SHA1[0x0d7d4a744fd92effd1ed88e48ac8231e, 0x7f7e9e6c]
    `,
    typeDefs: [
      {
        type: 'SHA1',
      },
    ],
    values: ['0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c'],
    displayValues: ['"0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c"'],
  },
];

export const specializationTests: Test[] = [
  {
    name: 'String(symbol)',
    query: `def output = :foo`,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'String',
          value: ':foo',
        },
      },
    ],
    values: [':foo'],
    displayValues: [':foo'],
  },
  {
    name: 'String',
    query: `
      def v = "foo"
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'String',
          value: ':foo',
        },
      },
    ],
    values: [':foo'],
    displayValues: [':foo'],
  },
  {
    name: 'String with slash',
    query: `
      def v = "foo / bar"
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'String',
          value: ':foo / bar',
        },
      },
    ],
    values: [':foo / bar'],
    displayValues: [':foo / bar'],
  },
  {
    name: 'Bool',
    query: `
      def v = boolean_true
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Bool',
          value: true,
        },
      },
    ],
    values: [true],
    displayValues: ['true'],
  },
  {
    name: 'Char',
    query: `
      def v = '👍'
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Char',
          value: '👍',
        },
      },
    ],
    values: ['👍'],
    displayValues: ["'👍'"],
  },
  {
    name: 'DateTime',
    query: `
      def v = 2021-10-12T01:22:31+10:00
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'DateTime',
          value: new Date('2021-10-11T15:22:31.000Z'),
        },
      },
    ],
    values: [new Date('2021-10-11T15:22:31.000Z')],
    displayValues: ['2021-10-11T15:22:31.000Z'],
    // TODO enable this when DateTime serialization fixed
    skip: true,
  },
  {
    name: 'Date',
    query: `
      def v = 2021-10-12
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Date',
          value: new Date('2021-10-12'),
        },
      },
    ],
    values: [new Date('2021-10-12')],
    displayValues: ['2021-10-12'],
  },
  {
    name: 'Year',
    query: `
      def v = Year[2022]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Year',
          value: 2022n,
        },
      },
    ],
    values: [2022n],
    displayValues: ['2022'],
  },
  {
    name: 'Month',
    query: `
      def v = Month[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Month',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Week',
    query: `
      def v = Week[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Week',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Day',
    query: `
      def v = Day[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Day',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hour',
    query: `
      def v = Hour[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Hour',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Minute',
    query: `
      def v = Minute[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Minute',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Second',
    query: `
      def v = Second[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Second',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Millisecond',
    query: `
      def v = Millisecond[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Millisecond',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Microsecond',
    query: `
      def v = Microsecond[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Microsecond',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Nanosecond',
    query: `
      def v = Nanosecond[1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Nanosecond',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hash',
    query: `
      entity type Foo = Int
      def v = ^Foo[12]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Hash',
          value: 290925887971139297379988470542779955742n,
        },
      },
    ],
    values: [290925887971139297379988470542779955742n],
    displayValues: ['290925887971139297379988470542779955742'],
  },
  {
    name: 'Missing',
    query: `
      def v = missing
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Missing',
          value: null,
        },
      },
    ],
    values: [null],
    displayValues: ['missing'],
  },
  {
    name: 'FilePos',
    query: `
      def config:data="""
      a,b,c
      1,2,3
      """

      def csv = load_csv[config]
      def v(p) = csv(_, p, _)
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'FilePos',
          value: 2n,
        },
      },
    ],
    values: [2n],
    displayValues: ['2'],
  },
  {
    name: 'Int8',
    query: `
      def v = int[8, -12]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Int8',
          value: -12,
        },
      },
    ],
    values: [-12],
    displayValues: ['-12'],
  },
  {
    name: 'Int16',
    query: `
      def v = int[16, -123]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Int16',
          value: -123,
        },
      },
    ],
    values: [-123],
    displayValues: ['-123'],
  },
  {
    name: 'Int32',
    query: `
      def v = int[32, -1234]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Int32',
          value: -1234,
        },
      },
    ],
    values: [-1234],
    displayValues: ['-1234'],
  },
  {
    name: 'Int64',
    query: `
      def v = int[64, -12345]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Int64',
          value: -12345n,
        },
      },
    ],
    values: [-12345n],
    displayValues: ['-12345'],
  },
  {
    name: 'Int128',
    query: `
      def v = int[128, 123456789101112131415]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Int128',
          value: 123456789101112131415n,
        },
      },
    ],
    values: [123456789101112131415n],
    displayValues: ['123456789101112131415'],
  },
  {
    name: 'UInt8',
    query: `
      def v = uint[8, 12]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'UInt8',
          value: 12,
        },
      },
    ],
    values: [12],
    displayValues: ['12'],
  },
  {
    name: 'UInt16',
    query: `
      def v = uint[16, 123]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'UInt16',
          value: 123,
        },
      },
    ],
    values: [123],
    displayValues: ['123'],
  },
  {
    name: 'UInt32',
    query: `
      def v = uint[32, 1234]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'UInt32',
          value: 1234,
        },
      },
    ],
    values: [1234],
    displayValues: ['1234'],
  },
  {
    name: 'UInt64',
    query: `
      def v = uint[64, 12345]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'UInt64',
          value: 12345n,
        },
      },
    ],
    values: [12345n],
    displayValues: ['12345'],
  },
  {
    name: 'UInt128',
    query: `
      def v = uint[128, 123456789101112131415]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'UInt128',
          value: 123456789101112131415n,
        },
      },
    ],
    values: [123456789101112131415n],
    displayValues: ['123456789101112131415'],
  },
  {
    name: 'Float16',
    query: `
      def v = float[16, 42.5]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Float16',
          value: 42.5,
        },
      },
    ],
    values: [42.5],
    displayValues: ['42.5'],
  },
  {
    name: 'Float32',
    query: `
      def v = float[32, 42.5]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Float32',
          value: 42.5,
        },
      },
    ],
    values: [42.5],
    displayValues: ['42.5'],
  },
  {
    name: 'Float64',
    query: `
      def v = float[64, 42.5]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Float64',
          value: 42.5,
        },
      },
    ],
    values: [42.5],
    displayValues: ['42.5'],
  },
  {
    name: 'Decimal16',
    query: `
      def v = parse_decimal[16, 2, "12.34"]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Decimal16',
          value: new Decimal('12.34'),
          places: 2,
        },
      },
    ],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal32',
    query: `
      def v = parse_decimal[32, 2, "12.34"]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Decimal32',
          value: new Decimal('12.34'),
          places: 2,
        },
      },
    ],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal64',
    query: `
      def v = parse_decimal[64, 2, "12.34"]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Decimal64',
          value: new Decimal('12.34'),
          places: 2,
        },
      },
    ],
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal128',
    query: `
      def v = parse_decimal[128, 2, "123456789010111213141516171819202122.34"]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Decimal128',
          value: new Decimal('123456789010111213141516171819202122.34'),
          places: 2,
        },
      },
    ],
    values: [new Decimal('123456789010111213141516171819202122.34')],
    displayValues: ['123456789010111213141516171819202122.34'],
  },
  {
    name: 'Rational8',
    values: [
      {
        numerator: 1,
        denominator: 2,
      },
    ],
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Rational8',
          value: { numerator: 1, denominator: 2 },
        },
      },
    ],
    query: `
      def v = rational[8, 1, 2]
      def output = #(v)
    `,
    displayValues: ['1/2'],
  },
  {
    name: 'Rational16',
    query: `
      def v = rational[16, 1, 2]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Rational16',
          value: { numerator: 1, denominator: 2 },
        },
      },
    ],
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
    query: `
      def v = rational[32, 1, 2]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Rational32',
          value: { numerator: 1, denominator: 2 },
        },
      },
    ],
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
    query: `
      def v = rational[64, 1, 2]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Rational64',
          value: { numerator: 1n, denominator: 2n },
        },
      },
    ],
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
    query: `
      def v = rational[128, 123456789101112313, 9123456789101112313]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'Rational128',
          value: {
            numerator: 123456789101112313n,
            denominator: 9123456789101112313n,
          },
        },
      },
    ],
    values: [
      {
        numerator: 123456789101112313n,
        denominator: 9123456789101112313n,
      },
    ],
    displayValues: ['123456789101112313/9123456789101112313'],
  },
  {
    name: 'AutoNumber',
    query: `
      def num = auto_number["a"]
      def v(x) = num(_, x)
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'AutoNumber',
          value: 1n,
        },
      },
    ],
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'UUID',
    query: `
      with rel:base use uuid_from_string
      def v = uuid_from_string["22b4a8a1-e548-4eeb-9270-60426d66a48e"]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'UUID',
          value: '22b4a8a1-e548-4eeb-9270-60426d66a48e',
        },
      },
    ],
    values: ['22b4a8a1-e548-4eeb-9270-60426d66a48e'],
    displayValues: ['"22b4a8a1-e548-4eeb-9270-60426d66a48e"'],
  },
  {
    name: 'SHA1',
    query: `
      with rel:base use ^SHA1
      def v = ^SHA1[0x0d7d4a744fd92effd1ed88e48ac8231e, 0x7f7e9e6c]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'SHA1',
          value: '0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c',
        },
      },
    ],
    values: ['0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c'],
    displayValues: ['"0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c"'],
  },
];

export const valueTypeTests: Test[] = [
  {
    name: 'String(symbol)',
    query: `
      value type MyType = :foo; :bar; :baz
      def output = ^MyType[:foo]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Constant',
            value: { type: 'String', value: ':foo' },
          },
        ],
      },
    ],
    values: [[':MyType', ':foo']],
    displayValues: ['(:MyType, :foo)'],
  },
  {
    name: 'String',
    query: `
      value type MyType = Int, String
      def output = ^MyType[1, "abc"]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'String',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 'abc']],
    displayValues: ['(:MyType, 1, "abc")'],
  },
  {
    name: 'Bool',
    query: `
      value type MyType = Int, Boolean
      def output = ^MyType[1, boolean_false]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Bool',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, false]],
    displayValues: ['(:MyType, 1, false)'],
  },
  {
    name: 'Char',
    query: `
      value type MyType = Int, Char
      def output = ^MyType[1, '👍']
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Char',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, '👍']],
    displayValues: ["(:MyType, 1, '👍')"],
  },
  {
    name: 'DateTime',
    query: `
      value type MyType = Int, DateTime
      def output = ^MyType[1, 2021-10-12T01:22:31+10:00]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'DateTime',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, new Date('2021-10-11T15:22:31.000Z')]],
    displayValues: ['(:MyType, 1, 2021-10-11T15:22:31.000Z)'],
  },
  {
    name: 'Date',
    query: `
      value type MyType = Int, Date
      def output = ^MyType[1, 2021-10-12]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Date',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, new Date('2021-10-12')]],
    displayValues: ['(:MyType, 1, 2021-10-12)'],
  },
  {
    name: 'Year',
    query: `
      value type MyType = Int, is_Year
      def output = ^MyType[1, Year[2022]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Year',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2022n]],
    displayValues: ['(:MyType, 1, 2022)'],
  },
  {
    name: 'Month',
    query: `
      value type MyType = Int, is_Month
      def output = ^MyType[1, Month[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Month',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Week',
    query: `
      value type MyType = Int, is_Week
      def output = ^MyType[1, Week[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Week',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Day',
    query: `
      value type MyType = Int, is_Day
      def output = ^MyType[1, Day[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Day',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Hour',
    query: `
      value type MyType = Int, is_Hour
      def output = ^MyType[1, Hour[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Hour',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Minute',
    query: `
      value type MyType = Int, is_Minute
      def output = ^MyType[1, Minute[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Minute',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Second',
    query: `
      value type MyType = Int, is_Second
      def output = ^MyType[1, Second[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Second',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Millisecond',
    query: `
      value type MyType = Int, is_Millisecond
      def output = ^MyType[1, Millisecond[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Millisecond',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Microsecond',
    query: `
      value type MyType = Int, is_Microsecond
      def output = ^MyType[1, Microsecond[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Microsecond',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Nanosecond',
    query: `
      value type MyType = Int, is_Nanosecond
      def output = ^MyType[1, Nanosecond[2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Nanosecond',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Hash',
    query: `
      value type MyType = Int, Hash
      def h(x) = hash128["abc", _, x]
      def output = ^MyType[1, h]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Hash',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 59005302613613978016770438099762432572n]],
    displayValues: ['(:MyType, 1, 59005302613613978016770438099762432572)'],
  },
  {
    name: 'Missing',
    query: `
      value type MyType = Int, Missing
      def output = ^MyType[1, missing]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Missing',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, null]],
    displayValues: ['(:MyType, 1, missing)'],
  },
  {
    name: 'FilePos',
    query: `
      def config:data="""
      a,b,c
      1,2,3
      """
      
      def csv = load_csv[config]
      def v(p) = csv(_, p, _)
      value type MyType = Int, FilePos
      def output = ^MyType[1, v]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'FilePos',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 2n]],
    displayValues: ['(:MyType, 1, 2)'],
  },
  {
    name: 'Int8',
    query: `
      value type MyType = Int, SignedInt[8]
      def output = ^MyType[1, int[8, -12]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Int8',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, -12]],
    displayValues: ['(:MyType, 1, -12)'],
  },
  {
    name: 'Int16',
    query: `
      value type MyType = Int, SignedInt[16]
      def output = ^MyType[1, int[16, -123]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Int16',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, -123]],
    displayValues: ['(:MyType, 1, -123)'],
  },
  {
    name: 'Int32',
    query: `
      value type MyType = Int, SignedInt[32]
      def output = ^MyType[1, int[32, -1234]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Int32',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, -1234]],
    displayValues: ['(:MyType, 1, -1234)'],
  },
  {
    name: 'Int64',
    query: `
      value type MyType = Int, SignedInt[64]
      def output = ^MyType[1, int[64, -12345]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Int64',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, -12345n]],
    displayValues: ['(:MyType, 1, -12345)'],
  },
  {
    name: 'Int128',
    query: `
      value type MyType = Int, SignedInt[128]
      def output = ^MyType[1, int[128, 123456789101112131415]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Int128',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 123456789101112131415n]],
    displayValues: ['(:MyType, 1, 123456789101112131415)'],
  },
  {
    name: 'UInt8',
    query: `
      value type MyType = Int, UnsignedInt[8]
      def output = ^MyType[1, uint[8, 12]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'UInt8',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 12]],
    displayValues: ['(:MyType, 1, 12)'],
  },
  {
    name: 'UInt16',
    query: `
      value type MyType = Int, UnsignedInt[16]
      def output = ^MyType[1, uint[16, 123]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'UInt16',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 123]],
    displayValues: ['(:MyType, 1, 123)'],
  },
  {
    name: 'UInt32',
    query: `
      value type MyType = Int, UnsignedInt[32]
      def output = ^MyType[1, uint[32, 1234]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'UInt32',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 1234]],
    displayValues: ['(:MyType, 1, 1234)'],
  },
  {
    name: 'UInt64',
    query: `
      value type MyType = Int, UnsignedInt[64]
      def output = ^MyType[1, uint[64, 12345]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'UInt64',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 12345n]],
    displayValues: ['(:MyType, 1, 12345)'],
  },
  {
    name: 'UInt128',
    query: `
      value type MyType = Int, UnsignedInt[128]
      def output = ^MyType[1, uint[128, 123456789101112131415]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'UInt128',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 123456789101112131415n]],
    displayValues: ['(:MyType, 1, 123456789101112131415)'],
  },
  {
    name: 'Float16',
    query: `
      value type MyType = Int, Floating[16]
      def output = ^MyType[1, float[16, 42.5]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Float16',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 42.5]],
    displayValues: ['(:MyType, 1, 42.5)'],
  },
  {
    name: 'Float32',
    query: `
      value type MyType = Int, Floating[32]
      def output = ^MyType[1, float[32, 42.5]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Float32',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 42.5]],
    displayValues: ['(:MyType, 1, 42.5)'],
  },
  {
    name: 'Float64',
    query: `
      value type MyType = Int, Floating[64]
      def output = ^MyType[1, float[64, 42.5]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Float64',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 42.5]],
    displayValues: ['(:MyType, 1, 42.5)'],
  },
  {
    name: 'Decimal16',
    query: `
      value type MyType = Int, FixedDecimal[16, 2]
      def output = ^MyType[1, parse_decimal[16, 2, "12.34"]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Decimal16',
            places: 2,
          },
        ],
      },
    ],
    values: [[':MyType', 1n, new Decimal('12.34')]],
    displayValues: ['(:MyType, 1, 12.34)'],
  },
  {
    name: 'Decimal32',
    query: `
      value type MyType = Int, FixedDecimal[32, 2]
      def output = ^MyType[1, parse_decimal[32, 2, "12.34"]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Decimal32',
            places: 2,
          },
        ],
      },
    ],
    values: [[':MyType', 1n, new Decimal('12.34')]],
    displayValues: ['(:MyType, 1, 12.34)'],
  },
  {
    name: 'Decimal64',
    query: `
      value type MyType = Int, FixedDecimal[64, 2]
      def output = ^MyType[1, parse_decimal[64, 2, "12.34"]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Decimal64',
            places: 2,
          },
        ],
      },
    ],
    values: [[':MyType', 1n, new Decimal('12.34')]],
    displayValues: ['(:MyType, 1, 12.34)'],
  },
  {
    name: 'Decimal128',
    query: `
      value type MyType = Int, FixedDecimal[128, 2]
      def output = ^MyType[1, parse_decimal[128, 2, "123456789010111213141516171819202122.34"]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Decimal128',
            places: 2,
          },
        ],
      },
    ],
    values: [
      [':MyType', 1n, new Decimal('123456789010111213141516171819202122.34')],
    ],
    displayValues: ['(:MyType, 1, 123456789010111213141516171819202122.34)'],
  },
  {
    name: 'Rational8',
    query: `
      value type MyType = Int, Rational[8]
      def output = ^MyType[1, rational[8, 1, 2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Rational8',
          },
        ],
      },
    ],
    values: [
      [
        ':MyType',
        1n,
        {
          numerator: 1,
          denominator: 2,
        },
      ],
    ],
    displayValues: ['(:MyType, 1, 1/2)'],
  },
  {
    name: 'Rational16',
    query: `
      value type MyType = Int, Rational[16]
      def output = ^MyType[1, rational[16, 1, 2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Rational16',
          },
        ],
      },
    ],
    values: [
      [
        ':MyType',
        1n,
        {
          numerator: 1,
          denominator: 2,
        },
      ],
    ],
    displayValues: ['(:MyType, 1, 1/2)'],
  },
  {
    name: 'Rational32',
    query: `
      value type MyType = Int, Rational[32]
      def output = ^MyType[1, rational[32, 1, 2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Rational32',
          },
        ],
      },
    ],
    values: [
      [
        ':MyType',
        1n,
        {
          numerator: 1,
          denominator: 2,
        },
      ],
    ],
    displayValues: ['(:MyType, 1, 1/2)'],
  },
  {
    name: 'Rational64',
    query: `
      value type MyType = Int, Rational[64]
      def output = ^MyType[1, rational[64, 1, 2]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Rational64',
          },
        ],
      },
    ],
    values: [
      [
        ':MyType',
        1n,
        {
          numerator: 1n,
          denominator: 2n,
        },
      ],
    ],
    displayValues: ['(:MyType, 1, 1/2)'],
  },
  {
    name: 'Rational128',
    query: `
      value type MyType = Int, Rational[128]
      def output = ^MyType[1, rational[128, 123456789101112313, 9123456789101112313]]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Rational128',
          },
        ],
      },
    ],
    values: [
      [
        ':MyType',
        1n,
        {
          numerator: 123456789101112313n,
          denominator: 9123456789101112313n,
        },
      ],
    ],
    displayValues: ['(:MyType, 1, 123456789101112313/9123456789101112313)'],
  },
  {
    name: 'AutoNumber',
    query: `
      def num = auto_number["a"]
      def anum(x) = num(_, x)
      value type MyType = Int, AutoNumber
      def output = ^MyType[1, anum]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'AutoNumber',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, 1n]],
    displayValues: ['(:MyType, 1, 1)'],
  },
  {
    name: 'UUID',
    query: `
      with rel:base use uuid_from_string, UUID
      def uuid = uuid_from_string["22b4a8a1-e548-4eeb-9270-60426d66a48e"]
      value type MyType = Int, UUID
      def output = ^MyType[1, uuid]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'UUID',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, '22b4a8a1-e548-4eeb-9270-60426d66a48e']],
    displayValues: ['(:MyType, 1, "22b4a8a1-e548-4eeb-9270-60426d66a48e")'],
  },
  {
    name: 'SHA1',
    query: `
      with rel:base use ^SHA1, SHA1
      def sha1 = ^SHA1[0x0d7d4a744fd92effd1ed88e48ac8231e, 0x7f7e9e6c]
      value type MyType = Int, SHA1
      def output = ^MyType[1, sha1]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'SHA1',
          },
        ],
      },
    ],
    values: [[':MyType', 1n, '0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c']],
    displayValues: ['(:MyType, 1, "0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c")'],
  },
];

export const miscValueTypeTests: Test[] = [
  {
    name: 'Int',
    query: `
      value type MyType = Int
      def output = ^MyType[123]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
        ],
      },
    ],
    values: [[':MyType', 123n]],
    displayValues: ['(:MyType, 123)'],
  },
  {
    name: 'Int128',
    query: `
      value type MyType = SignedInt[128]
      def output = ^MyType[123445677777999999999]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int128',
          },
        ],
      },
    ],
    values: [[':MyType', 123445677777999999999n]],
    displayValues: ['(:MyType, 123445677777999999999)'],
  },
  {
    name: 'Date',
    query: `
      value type MyType = Date
      def output = ^MyType[2021-10-12]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Date',
          },
        ],
      },
    ],
    values: [[':MyType', new Date('2021-10-12')]],
    displayValues: ['(:MyType, 2021-10-12)'],
  },
  {
    name: 'OuterType(InnerType(Int, String), String)',
    query: `
      value type InnerType = Int, String
      value type OuterType = InnerType, String
      def output = ^OuterType[^InnerType[123, "inner"], "outer"]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':OuterType' },
          },
          {
            type: 'ValueType',
            typeDefs: [
              {
                type: 'Constant',
                value: { type: 'String', value: ':InnerType' },
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
    ],
    values: [[':OuterType', [':InnerType', 123n, 'inner'], 'outer']],
    displayValues: ['(:OuterType, (:InnerType, 123, "inner"), "outer")'],
  },
  {
    name: 'Module',
    query: `
      module Foo
        module Bar
          value type MyType = Int, Int
        end
      end
      def output = Foo:Bar:^MyType[12, 34]
    `,
    typeDefs: [
      {
        type: 'ValueType',
        typeDefs: [
          {
            type: 'Constant',
            value: { type: 'String', value: ':Foo' },
          },
          {
            type: 'Constant',
            value: { type: 'String', value: ':Bar' },
          },
          {
            type: 'Constant',
            value: { type: 'String', value: ':MyType' },
          },
          {
            type: 'Int64',
          },
          {
            type: 'Int64',
          },
        ],
      },
    ],
    values: [[':Foo', ':Bar', ':MyType', 12n, 34n]],
    displayValues: ['(:Foo, :Bar, :MyType, 12, 34)'],
  },
];

export const valueTypeSpecializationTests: Test[] = [
  {
    name: 'String(symbol)',
    query: `
      value type MyType = :foo; :bar; :baz
      def v = ^MyType[:foo]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Constant',
              value: { type: 'String', value: ':foo' },
            },
          ],
          value: [':MyType', ':foo'],
        },
      },
    ],
    values: [[':MyType', ':foo']],
    displayValues: ['(:MyType, :foo)'],
  },
  {
    name: 'String',
    query: `
      value type MyType = String, Int
      def v = ^MyType["abc", 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'String',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', ':abc', 1n],
        },
      },
    ],
    values: [[':MyType', ':abc', 1n]],
    displayValues: ['(:MyType, ":abc", 1)'],
  },
  {
    name: 'Bool',
    query: `
      value type MyType = Boolean, Int
      def v = ^MyType[boolean_false, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Bool',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', false, 1n],
        },
      },
    ],
    values: [[':MyType', false, 1n]],
    displayValues: ['(:MyType, false, 1)'],
  },
  {
    name: 'Char',
    query: `
      value type MyType = Char, Int
      def v = ^MyType['👍', 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Char',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', '👍', 1n],
        },
      },
    ],
    values: [[':MyType', '👍', 1n]],
    displayValues: ["(:MyType, '👍', 1)"],
  },
  {
    name: 'DateTime',
    query: `
      value type MyType = DateTime, Int
      def v = ^MyType[2021-10-12T01:22:31+10:00, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'DateTime',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', new Date('2021-10-11T15:22:31.000Z'), 1n],
        },
      },
    ],
    values: [[':MyType', new Date('2021-10-11T15:22:31.000Z'), 1n]],
    displayValues: ['(:MyType, 2021-10-11T15:22:31.000Z, 1)'],
    // TODO enable this when DateTime serialization fixed
    skip: true,
  },
  {
    name: 'Date',
    query: `
      value type MyType = Date, Int
      def v = ^MyType[2021-10-12, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Date',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', new Date('2021-10-12'), 1n],
        },
      },
    ],
    values: [[':MyType', new Date('2021-10-12'), 1n]],
    displayValues: ['(:MyType, 2021-10-12, 1)'],
  },
  {
    name: 'Year',
    query: `
      value type MyType = is_Year, Int
      def v = ^MyType[Year[2022], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Year',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2022n, 1n],
        },
      },
    ],
    values: [[':MyType', 2022n, 1n]],
    displayValues: ['(:MyType, 2022, 1)'],
  },
  {
    name: 'Month',
    query: `
      value type MyType = is_Month, Int
      def v = ^MyType[Month[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Month',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Week',
    query: `
      value type MyType = is_Week, Int
      def v = ^MyType[Week[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Week',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Day',
    query: `
      value type MyType = is_Day, Int
      def v = ^MyType[Day[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Day',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Hour',
    query: `
      value type MyType = is_Hour, Int
      def v = ^MyType[Hour[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Hour',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Minute',
    query: `
      value type MyType = is_Minute, Int
      def v = ^MyType[Minute[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Minute',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Second',
    query: `
      value type MyType = is_Second, Int
      def v = ^MyType[Second[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Second',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Millisecond',
    query: `
      value type MyType = is_Millisecond, Int
      def v = ^MyType[Millisecond[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Millisecond',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Microsecond',
    query: `
      value type MyType = is_Microsecond, Int
      def v = ^MyType[Microsecond[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Microsecond',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Nanosecond',
    query: `
      value type MyType = is_Nanosecond, Int
      def v = ^MyType[Nanosecond[2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Nanosecond',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Hash',
    query: `
      value type MyType = Hash, Int
      def h(x) = hash128["abc", _, x]
      def v = ^MyType[h, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Hash',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 59005302613613978016770438099762432572n, 1n],
        },
      },
    ],
    values: [[':MyType', 59005302613613978016770438099762432572n, 1n]],
    displayValues: ['(:MyType, 59005302613613978016770438099762432572, 1)'],
  },
  {
    name: 'Missing',
    query: `
      value type MyType = Missing, Int
      def v = ^MyType[missing, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Missing',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', null, 1n],
        },
      },
    ],
    values: [[':MyType', null, 1n]],
    displayValues: ['(:MyType, missing, 1)'],
  },
  {
    name: 'FilePos',
    query: `
      def config:data="""
      a,b,c
      1,2,3
      """
      
      def csv = load_csv[config]
      def f(p) = csv(_, p, _)
      value type MyType = FilePos, Int
      def v = ^MyType[f, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'FilePos',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 2n, 1n],
        },
      },
    ],
    values: [[':MyType', 2n, 1n]],
    displayValues: ['(:MyType, 2, 1)'],
  },
  {
    name: 'Int8',
    query: `
      value type MyType = SignedInt[8], Int
      def v = ^MyType[int[8, -12], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Int8',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', -12, 1n],
        },
      },
    ],
    values: [[':MyType', -12, 1n]],
    displayValues: ['(:MyType, -12, 1)'],
  },
  {
    name: 'Int16',
    query: `
      value type MyType = SignedInt[16], Int
      def v = ^MyType[int[16, -123], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Int16',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', -123, 1n],
        },
      },
    ],
    values: [[':MyType', -123, 1n]],
    displayValues: ['(:MyType, -123, 1)'],
  },
  {
    name: 'Int32',
    query: `
      value type MyType = SignedInt[32], Int
      def v = ^MyType[int[32, -1234], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Int32',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', -1234, 1n],
        },
      },
    ],
    values: [[':MyType', -1234, 1n]],
    displayValues: ['(:MyType, -1234, 1)'],
  },
  {
    name: 'Int64',
    query: `
      value type MyType = SignedInt[64], Int
      def v = ^MyType[int[64, -12345], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Int64',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', -12345n, 1n],
        },
      },
    ],
    values: [[':MyType', -12345n, 1n]],
    displayValues: ['(:MyType, -12345, 1)'],
  },
  {
    name: 'Int128',
    query: `
      value type MyType = SignedInt[128], Int
      def v = ^MyType[int[128, 123456789101112131415], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Int128',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 123456789101112131415n, 1n],
        },
      },
    ],
    values: [[':MyType', 123456789101112131415n, 1n]],
    displayValues: ['(:MyType, 123456789101112131415, 1)'],
  },
  {
    name: 'UInt8',
    query: `
      value type MyType = UnsignedInt[8], Int
      def v = ^MyType[uint[8, 12], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'UInt8',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 12, 1n],
        },
      },
    ],
    values: [[':MyType', 12, 1n]],
    displayValues: ['(:MyType, 12, 1)'],
  },
  {
    name: 'UInt16',
    query: `
      value type MyType = UnsignedInt[16], Int
      def v = ^MyType[uint[16, 123], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'UInt16',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 123, 1n],
        },
      },
    ],
    values: [[':MyType', 123, 1n]],
    displayValues: ['(:MyType, 123, 1)'],
  },
  {
    name: 'UInt32',
    query: `
      value type MyType = UnsignedInt[32], Int
      def v = ^MyType[uint[32, 1234], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'UInt32',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 1234, 1n],
        },
      },
    ],
    values: [[':MyType', 1234, 1n]],
    displayValues: ['(:MyType, 1234, 1)'],
  },
  {
    name: 'UInt64',
    query: `
      value type MyType = UnsignedInt[64], Int
      def v = ^MyType[uint[64, 12345], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'UInt64',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 12345n, 1n],
        },
      },
    ],
    values: [[':MyType', 12345n, 1n]],
    displayValues: ['(:MyType, 12345, 1)'],
  },
  {
    name: 'UInt128',
    query: `
      value type MyType = UnsignedInt[128], Int
      def v = ^MyType[uint[128, 123456789101112131415], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'UInt128',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 123456789101112131415n, 1n],
        },
      },
    ],
    values: [[':MyType', 123456789101112131415n, 1n]],
    displayValues: ['(:MyType, 123456789101112131415, 1)'],
  },
  {
    name: 'Float16',
    query: `
      value type MyType = Floating[16], Int
      def v = ^MyType[float[16, 42.5], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Float16',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 42.5, 1n],
        },
      },
    ],
    values: [[':MyType', 42.5, 1n]],
    displayValues: ['(:MyType, 42.5, 1)'],
  },
  {
    name: 'Float32',
    query: `
      value type MyType = Floating[32], Int
      def v = ^MyType[float[32, 42.5], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Float32',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 42.5, 1n],
        },
      },
    ],
    values: [[':MyType', 42.5, 1n]],
    displayValues: ['(:MyType, 42.5, 1)'],
  },
  {
    name: 'Float64',
    query: `
      value type MyType = Floating[64], Int
      def v = ^MyType[float[64, 42.5], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Float64',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 42.5, 1n],
        },
      },
    ],
    values: [[':MyType', 42.5, 1n]],
    displayValues: ['(:MyType, 42.5, 1)'],
  },
  {
    name: 'Decimal16',
    query: `
      value type MyType = FixedDecimal[16, 2], Int
      def v = ^MyType[parse_decimal[16, 2, "12.34"], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Decimal16',
              places: 2,
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', new Decimal('12.34'), 1n],
        },
      },
    ],
    values: [[':MyType', new Decimal('12.34'), 1n]],
    displayValues: ['(:MyType, 12.34, 1)'],
  },
  {
    name: 'Decimal32',
    query: `
      value type MyType = FixedDecimal[32, 2], Int
      def v = ^MyType[parse_decimal[32, 2, "12.34"], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Decimal32',
              places: 2,
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', new Decimal('12.34'), 1n],
        },
      },
    ],
    values: [[':MyType', new Decimal('12.34'), 1n]],
    displayValues: ['(:MyType, 12.34, 1)'],
  },
  {
    name: 'Decimal64',
    query: `
      value type MyType = FixedDecimal[64, 2], Int
      def v = ^MyType[parse_decimal[64, 2, "12.34"], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Decimal64',
              places: 2,
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', new Decimal('12.34'), 1n],
        },
      },
    ],
    values: [[':MyType', new Decimal('12.34'), 1n]],
    displayValues: ['(:MyType, 12.34, 1)'],
  },
  {
    name: 'Decimal128',
    query: `
      value type MyType = FixedDecimal[128, 2], Int
      def v = ^MyType[parse_decimal[128, 2, "123456789010111213141516171819202122.34"], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Decimal128',
              places: 2,
            },
            {
              type: 'Int64',
            },
          ],
          value: [
            ':MyType',
            new Decimal('123456789010111213141516171819202122.34'),
            1n,
          ],
        },
      },
    ],
    values: [
      [':MyType', new Decimal('123456789010111213141516171819202122.34'), 1n],
    ],
    displayValues: ['(:MyType, 123456789010111213141516171819202122.34, 1)'],
  },
  {
    name: 'Rational8',
    query: `
      value type MyType = Rational[8], Int
      def v = ^MyType[rational[8, 1, 2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Rational8',
            },
            {
              type: 'Int64',
            },
          ],
          value: [
            ':MyType',
            {
              numerator: 1,
              denominator: 2,
            },
            1n,
          ],
        },
      },
    ],
    values: [
      [
        ':MyType',
        {
          numerator: 1,
          denominator: 2,
        },
        1n,
      ],
    ],
    displayValues: ['(:MyType, 1/2, 1)'],
  },
  {
    name: 'Rational16',
    query: `
      value type MyType = Rational[16], Int
      def v = ^MyType[rational[16, 1, 2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Rational16',
            },
            {
              type: 'Int64',
            },
          ],
          value: [
            ':MyType',
            {
              numerator: 1,
              denominator: 2,
            },
            1n,
          ],
        },
      },
    ],
    values: [
      [
        ':MyType',
        {
          numerator: 1,
          denominator: 2,
        },
        1n,
      ],
    ],
    displayValues: ['(:MyType, 1/2, 1)'],
  },
  {
    name: 'Rational32',
    query: `
      value type MyType = Rational[32], Int
      def v = ^MyType[rational[32, 1, 2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Rational32',
            },
            {
              type: 'Int64',
            },
          ],
          value: [
            ':MyType',
            {
              numerator: 1,
              denominator: 2,
            },
            1n,
          ],
        },
      },
    ],
    values: [
      [
        ':MyType',
        {
          numerator: 1,
          denominator: 2,
        },
        1n,
      ],
    ],
    displayValues: ['(:MyType, 1/2, 1)'],
  },
  {
    name: 'Rational64',
    query: `
      value type MyType = Rational[64], Int
      def v = ^MyType[rational[64, 1, 2], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Rational64',
            },
            {
              type: 'Int64',
            },
          ],
          value: [
            ':MyType',
            {
              numerator: 1n,
              denominator: 2n,
            },
            1n,
          ],
        },
      },
    ],
    values: [
      [
        ':MyType',
        {
          numerator: 1n,
          denominator: 2n,
        },
        1n,
      ],
    ],
    displayValues: ['(:MyType, 1/2, 1)'],
  },
  {
    name: 'Rational128',
    query: `
      value type MyType = Rational[128], Int
      def v = ^MyType[rational[128, 123456789101112313, 9123456789101112313], 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Rational128',
            },
            {
              type: 'Int64',
            },
          ],
          value: [
            ':MyType',
            {
              numerator: 123456789101112313n,
              denominator: 9123456789101112313n,
            },
            1n,
          ],
        },
      },
    ],
    values: [
      [
        ':MyType',
        {
          numerator: 123456789101112313n,
          denominator: 9123456789101112313n,
        },
        1n,
      ],
    ],
    displayValues: ['(:MyType, 123456789101112313/9123456789101112313, 1)'],
  },
  {
    name: 'AutoNumber',
    query: `
      def num = auto_number["a"]
      def anum(x) = num(_, x)
      value type MyType = AutoNumber, Int
      def v = ^MyType[anum, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'AutoNumber',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', 1n, 1n],
        },
      },
    ],
    values: [[':MyType', 1n, 1n]],
    displayValues: ['(:MyType, 1, 1)'],
  },
  {
    name: 'UUID',
    query: `
      with rel:base use uuid_from_string, UUID
      def uuid = uuid_from_string["22b4a8a1-e548-4eeb-9270-60426d66a48e"]
      value type MyType = UUID, Int
      def v = ^MyType[uuid, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'UUID',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', '22b4a8a1-e548-4eeb-9270-60426d66a48e', 1n],
        },
      },
    ],
    values: [[':MyType', '22b4a8a1-e548-4eeb-9270-60426d66a48e', 1n]],
    displayValues: ['(:MyType, "22b4a8a1-e548-4eeb-9270-60426d66a48e", 1)'],
  },
  {
    name: 'SHA1',
    query: `
      with rel:base use ^SHA1, SHA1
      def sha1 = ^SHA1[0x0d7d4a744fd92effd1ed88e48ac8231e, 0x7f7e9e6c]
      value type MyType = SHA1, Int
      def v = ^MyType[sha1, 1]
      def output = #(v)
    `,
    typeDefs: [
      {
        type: 'Constant',
        value: {
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'SHA1',
            },
            {
              type: 'Int64',
            },
          ],
          value: [':MyType', '0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c', 1n],
        },
      },
    ],
    values: [[':MyType', '0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c', 1n]],
    displayValues: ['(:MyType, "0d7d4a744fd92effd1ed88e48ac8231e7f7e9e6c", 1)'],
  },
];
