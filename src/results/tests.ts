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
  skip?: boolean;
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

export const specializationTests: Test[] = [
  {
    name: 'String(symbol)',
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
    query: `def output = :foo`,
    values: [':foo'],
    displayValues: [':foo'],
  },
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
      def v = "foo"
      def output = #(v)
    `,
    values: [':foo'],
    displayValues: [':foo'],
  },
  {
    name: 'String with slash',
    typeDef: {
      type: 'Constant',
      name: 'Symbol',
      value: [
        {
          type: 'String',
          value: ':foo / bar',
        },
      ],
    },
    query: `
      def v = "foo / bar"
      def output = #(v)
    `,
    values: [':foo / bar'],
    displayValues: [':foo / bar'],
  },
  {
    name: 'Bool',
    typeDef: {
      type: 'Constant',
      name: 'Bool(true)',
      value: [
        {
          type: 'Bool',
          value: true,
        },
      ],
    },
    query: `
      def v = boolean_true
      def output = #(v)
    `,
    values: [true],
    displayValues: ['true'],
  },
  {
    name: 'Char',
    typeDef: {
      type: 'Constant',
      name: 'Char(👍)',
      value: [
        {
          type: 'Char',
          value: '👍',
        },
      ],
    },
    query: `
      def v = '👍'
      def output = #(v)
    `,
    values: ['👍'],
    displayValues: ['👍'],
  },
  {
    name: 'DateTime',
    typeDef: {
      type: 'Constant',
      name: 'DateTime(2021-10-11T15:22:31.000Z)',
      value: [
        {
          type: 'DateTime',
          value: new Date('2021-10-11T15:22:31.000Z'),
        },
      ],
    },
    query: `
      def v = 2021-10-12T01:22:31+10:00
      def output = #(v)
    `,
    values: [new Date('2021-10-11T15:22:31.000Z')],
    displayValues: ['2021-10-11T15:22:31.000Z'],
  },
  {
    name: 'Date',
    typeDef: {
      type: 'Constant',
      name: 'Date(2021-10-12)',
      value: [
        {
          type: 'Date',
          value: new Date('2021-10-12'),
        },
      ],
    },
    query: `
      def v = 2021-10-12
      def output = #(v)
    `,
    values: [new Date('2021-10-12')],
    displayValues: ['2021-10-12'],
  },
  {
    name: 'Year',
    typeDef: {
      type: 'Constant',
      name: 'Year(2022)',
      value: [
        {
          type: 'Year',
          value: 2022n,
        },
      ],
    },
    query: `
      def v = Year[2022]
      def output = #(v)
    `,
    values: [2022n],
    displayValues: ['2022'],
  },
  {
    name: 'Month',
    typeDef: {
      type: 'Constant',
      name: 'Month(1)',
      value: [
        {
          type: 'Month',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Month[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Week',
    typeDef: {
      type: 'Constant',
      name: 'Week(1)',
      value: [
        {
          type: 'Week',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Week[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Day',
    typeDef: {
      type: 'Constant',
      name: 'Day(1)',
      value: [
        {
          type: 'Day',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Day[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hour',
    typeDef: {
      type: 'Constant',
      name: 'Hour(1)',
      value: [
        {
          type: 'Hour',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Hour[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Minute',
    typeDef: {
      type: 'Constant',
      name: 'Minute(1)',
      value: [
        {
          type: 'Minute',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Minute[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Second',
    typeDef: {
      type: 'Constant',
      name: 'Second(1)',
      value: [
        {
          type: 'Second',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Second[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Millisecond',
    typeDef: {
      type: 'Constant',
      name: 'Millisecond(1)',
      value: [
        {
          type: 'Millisecond',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Millisecond[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Microsecond',
    typeDef: {
      type: 'Constant',
      name: 'Microsecond(1)',
      value: [
        {
          type: 'Microsecond',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Microsecond[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Nanosecond',
    typeDef: {
      type: 'Constant',
      name: 'Nanosecond(1)',
      value: [
        {
          type: 'Nanosecond',
          value: 1n,
        },
      ],
    },
    query: `
      def v = Nanosecond[1]
      def output = #(v)
    `,
    values: [1n],
    displayValues: ['1'],
  },
  {
    name: 'Hash',
    typeDef: {
      type: 'Constant',
      name: 'Hash(290925887971139297379988470542779955742)',
      value: [
        {
          type: 'Hash',
          value: 1n,
        },
      ],
    },
    query: `
      entity type Foo = Int
      def v = ^Foo[12]
      def output = #(v)
    `,
    values: [290925887971139297379988470542779955742n],
    displayValues: ['290925887971139297379988470542779955742'],
  },
  {
    name: 'Missing',
    typeDef: {
      type: 'Constant',
      name: 'Missing(missing)',
      value: [
        {
          type: 'Missing',
          value: null,
        },
      ],
    },
    query: `
      def v = missing
      def output = #(v)
    `,
    values: [null],
    displayValues: ['missing'],
    // TODO enable this when specialization on Missing is fixed
    skip: true,
  },
  {
    name: 'FilePos',
    typeDef: {
      type: 'Constant',
      name: 'FilePos(2)',
      value: [
        {
          type: 'FilePos',
          value: 2n,
        },
      ],
    },
    query: `
      def config:data="""
      a,b,c
      1,2,3
      """

      def csv = load_csv[config]
      def v(p) = csv(_, p, _)
      def output = #(v)
    `,
    values: [2n],
    displayValues: ['2'],
  },
  {
    name: 'Int8',
    typeDef: {
      type: 'Constant',
      name: 'Int8(-12)',
      value: [
        {
          type: 'Int8',
          value: -12,
        },
      ],
    },
    query: `
      def v = int[8, -12]
      def output = #(v)
    `,
    values: [-12],
    displayValues: ['-12'],
  },
  {
    name: 'Int16',
    typeDef: {
      type: 'Constant',
      name: 'Int16(-123)',
      value: [
        {
          type: 'Int16',
          value: -123,
        },
      ],
    },
    query: `
      def v = int[16, -123]
      def output = #(v)
    `,
    values: [-123],
    displayValues: ['-123'],
  },
  {
    name: 'Int32',
    typeDef: {
      type: 'Constant',
      name: 'Int32(-1234)',
      value: [
        {
          type: 'Int32',
          value: -1234,
        },
      ],
    },
    query: `
      def v = int[32, -1234]
      def output = #(v)
    `,
    values: [-1234],
    displayValues: ['-1234'],
  },
  {
    name: 'Int64',
    typeDef: {
      type: 'Constant',
      name: 'Int64(-12345)',
      value: [
        {
          type: 'Int64',
          value: -12345n,
        },
      ],
    },
    query: `
      def v = int[64, -12345]
      def output = #(v)
    `,
    values: [-12345n],
    displayValues: ['-12345'],
  },
  {
    name: 'Int128',
    typeDef: {
      type: 'Constant',
      name: 'Int128(123456789101112131415)',
      value: [
        {
          type: 'Int128',
          value: 123456789101112131415n,
        },
      ],
    },
    query: `
      def v = int[128, 123456789101112131415]
      def output = #(v)
    `,
    values: [123456789101112131415n],
    displayValues: ['123456789101112131415'],
  },
  {
    name: 'UInt8',
    typeDef: {
      type: 'Constant',
      name: 'UInt8(12)',
      value: [
        {
          type: 'UInt8',
          value: 12,
        },
      ],
    },
    query: `
      def v = uint[8, 12]
      def output = #(v)
    `,
    values: [12],
    displayValues: ['12'],
  },
  {
    name: 'UInt16',
    typeDef: {
      type: 'Constant',
      name: 'UInt16(123)',
      value: [
        {
          type: 'UInt16',
          value: 123,
        },
      ],
    },
    query: `
      def v = uint[16, 123]
      def output = #(v)
    `,
    values: [123],
    displayValues: ['123'],
  },
  {
    name: 'UInt32',
    typeDef: {
      type: 'Constant',
      name: 'UInt32(1234)',
      value: [
        {
          type: 'UInt32',
          value: 1234,
        },
      ],
    },
    query: `
      def v = uint[32, 1234]
      def output = #(v)
    `,
    values: [1234],
    displayValues: ['1234'],
  },
  {
    name: 'UInt64',
    typeDef: {
      type: 'Constant',
      name: 'UInt64(12345)',
      value: [
        {
          type: 'UInt64',
          value: 12345n,
        },
      ],
    },
    query: `
      def v = uint[64, 12345]
      def output = #(v)
    `,
    values: [12345n],
    displayValues: ['12345'],
  },
  {
    name: 'UInt128',
    typeDef: {
      type: 'Constant',
      name: 'UInt128(123456789101112131415)',
      value: [
        {
          type: 'UInt128',
          value: 123456789101112131415n,
        },
      ],
    },
    query: `
      def v = uint[128, 123456789101112131415]
      def output = #(v)
    `,
    values: [123456789101112131415n],
    displayValues: ['123456789101112131415'],
  },
  {
    name: 'Float16',
    typeDef: {
      type: 'Constant',
      name: 'Float16(42.5)',
      value: [
        {
          type: 'Float16',
          value: 42.5,
        },
      ],
    },
    query: `
      def v = float[16, 42.5]
      def output = #(v)
    `,
    values: [42.5],
    displayValues: ['42.5'],
  },
  {
    name: 'Float32',
    typeDef: {
      type: 'Constant',
      name: 'Float32(42.5)',
      value: [
        {
          type: 'Float32',
          value: 42.5,
        },
      ],
    },
    query: `
      def v = float[32, 42.5]
      def output = #(v)
    `,
    values: [42.5],
    displayValues: ['42.5'],
  },
  {
    name: 'Float64',
    typeDef: {
      type: 'Constant',
      name: 'Float64(42.5)',
      value: [
        {
          type: 'Float64',
          value: 42.5,
        },
      ],
    },
    query: `
      def v = float[64, 42.5]
      def output = #(v)
    `,
    values: [42.5],
    displayValues: ['42.5'],
  },
  {
    name: 'Decimal16',
    typeDef: {
      type: 'Constant',
      name: 'Decimal16(12.34)',
      value: [
        {
          type: 'Decimal16',
          value: new Decimal('12.34'),
          places: 2,
        },
      ],
    },
    query: `
      def v = parse_decimal[16, 2, "12.34"]
      def output = #(v)
    `,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal32',
    typeDef: {
      type: 'Constant',
      name: 'Decimal32(12.34)',
      value: [
        {
          type: 'Decimal32',
          value: new Decimal('12.34'),
          places: 2,
        },
      ],
    },
    query: `
      def v = parse_decimal[32, 2, "12.34"]
      def output = #(v)
    `,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal64',
    typeDef: {
      type: 'Constant',
      name: 'Decimal64(12.34)',
      value: [
        {
          type: 'Decimal64',
          value: new Decimal('12.34'),
          places: 2,
        },
      ],
    },
    query: `
      def v = parse_decimal[64, 2, "12.34"]
      def output = #(v)
    `,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Decimal128',
    typeDef: {
      type: 'Constant',
      name: 'Decimal128(12345678901011121314.34)',
      value: [
        {
          type: 'Decimal128',
          value: new Decimal('12345678901011121314.34'),
          places: 2,
        },
      ],
    },
    query: `
      def v = parse_decimal[128, 2, "12345678901011121314.34"]
      def output = #(v)
    `,
    values: [new Decimal('12.34')],
    displayValues: ['12.34'],
  },
  {
    name: 'Rational8',
    typeDef: {
      type: 'Constant',
      name: 'Rational8(1/2)',
      value: [
        {
          type: 'Rational8',
          value: { numerator: 1, denominator: 2 },
        },
      ],
    },
    query: `
      def v = rational[8, 1, 2]
      def output = #(v)
    `,
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
      type: 'Constant',
      name: 'Rational16(1/2)',
      value: [
        {
          type: 'Rational16',
          value: { numerator: 1, denominator: 2 },
        },
      ],
    },
    query: `
      def v = rational[16, 1, 2]
      def output = #(v)
    `,
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
      type: 'Constant',
      name: 'Rational32(1/2)',
      value: [
        {
          type: 'Rational32',
          value: { numerator: 1, denominator: 2 },
        },
      ],
    },
    query: `
      def v = rational[32, 1, 2]
      def output = #(v)
    `,
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
      type: 'Constant',
      name: 'Rational64(1/2)',
      value: [
        {
          type: 'Rational64',
          value: { numerator: 1n, denominator: 2n },
        },
      ],
    },
    query: `
      def v = rational[64, 1, 2]
      def output = #(v)
    `,
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
      type: 'Constant',
      name: 'Rational128(1/2)',
      value: [
        {
          type: 'Rational128',
          value: {
            numerator: 123456789101112313n,
            denominator: 9123456789101112313n,
          },
        },
      ],
    },
    query: `
      def v = rational[128, 123456789101112313, 9123456789101112313]
      def output = #(v)
    `,
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
