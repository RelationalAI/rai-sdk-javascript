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

Decimal.config({ precision: 31 });

// Rata Die milliseconds for 1970-01-01T00:00:00.
// Date and DateTime types are represented as days and milliseconds
// respectively since 1 AD, following ISO 8601, which is the first
// year in the proleptic Gregorian calendar. JavaScript represents
// Date types as milliseconds since the UNIX epoch.
const UNIXEPOCH = 62135683200000;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const intRegEx = /^Int(\d+)$/;
const uintRegEx = /^UInt(\d+)$/;
const floatRegEx = /^Float(\d+)$/;
const decimalRegEx = /^FixedPointDecimals.FixedDecimal{Int(\d+), (\d+)}$/;
const rationalRegEx = /^Rational{Int(\d+)}$/;

export function getTypeDef(type: string): RelTypeDef {
  if (type.startsWith(':')) {
    return {
      type: 'Constant',
      name: 'Symbol',
      value: type,
    };
  }

  if (type.includes('(') && !type.startsWith('(')) {
    return {
      type: 'Constant',
      name: type,
      value: type,
    };
  }

  if (type === 'String') {
    return {
      type: 'String',
    };
  }

  if (type === 'Bool') {
    return {
      type: 'Bool',
    };
  }

  if (type === 'Char') {
    return {
      type: 'Char',
    };
  }

  if (type === 'Dates.DateTime') {
    return {
      type: 'DateTime',
    };
  }

  if (type === 'Dates.Date') {
    return {
      type: 'Date',
    };
  }

  if (type === 'Dates.Year') {
    return {
      type: 'Year',
    };
  }

  if (type === 'Dates.Month') {
    return {
      type: 'Month',
    };
  }

  if (type === 'Dates.Week') {
    return {
      type: 'Week',
    };
  }

  if (type === 'Dates.Day') {
    return {
      type: 'Day',
    };
  }

  if (type === 'Dates.Hour') {
    return {
      type: 'Hour',
    };
  }

  if (type === 'Dates.Minute') {
    return {
      type: 'Minute',
    };
  }

  if (type === 'Dates.Second') {
    return {
      type: 'Second',
    };
  }

  if (type === 'Dates.Millisecond') {
    return {
      type: 'Millisecond',
    };
  }

  if (type === 'Dates.Microsecond') {
    return {
      type: 'Microsecond',
    };
  }

  if (type === 'Dates.Nanosecond') {
    return {
      type: 'Nanosecond',
    };
  }

  if (type === 'HashValue') {
    return {
      type: 'Hash',
    };
  }

  if (type === 'Missing') {
    return {
      type: 'Missing',
    };
  }

  if (type === 'FilePos') {
    return {
      type: 'FilePos',
    };
  }

  const intMatch = type.match(intRegEx);

  if (intMatch && intMatch.length === 2) {
    const bits = intMatch[1];
    const type = `Int${bits}`;

    return {
      type: type as any,
    };
  }

  const uintMatch = type.match(uintRegEx);

  if (uintMatch && uintMatch.length === 2) {
    const bits = uintMatch[1];
    return {
      type: `UInt${bits}` as any,
    };
  }

  const floatMatch = type.match(floatRegEx);

  if (floatMatch && floatMatch.length === 2) {
    const bits = floatMatch[1];

    return {
      type: `Float${bits}` as any,
    };
  }

  const decimalMatch = type.match(decimalRegEx);

  if (decimalMatch && decimalMatch.length === 3) {
    const bits = Number.parseInt(decimalMatch[1]);
    const places = Number.parseInt(decimalMatch[2]);

    return {
      type: `Decimal${bits}` as any,
      places,
    };
  }

  const rationalMatch = type.match(rationalRegEx);

  if (rationalMatch && rationalMatch.length === 2) {
    const bits = rationalMatch[1];

    return {
      type: `Rational${bits}` as any,
    };
  }

  return {
    type: 'Unknown',
    name: type,
  };
}

export function convertValue<T extends RelTypedValue>(
  typeDef: RelTypeDef,
  value: any,
): T['value'] {
  switch (typeDef.type) {
    case 'String':
    case 'Bool':
      return value;
    case 'Char':
      return String.fromCodePoint(value);
    case 'DateTime':
      return new Date(Number(value) - UNIXEPOCH);
    case 'Date':
      return new Date(Number(value) * MILLISECONDS_PER_DAY - UNIXEPOCH);
    case 'Year':
    case 'Month':
    case 'Week':
    case 'Day':
    case 'Hour':
    case 'Minute':
    case 'Second':
    case 'Millisecond':
    case 'Microsecond':
    case 'Nanosecond':
      return value;
    case 'Missing':
      return null;
    case 'FilePos':
      return value;
    case 'Hash':
      return int128ToBigInt(Array.from(value));
    case 'Int8':
    case 'Int16':
    case 'Int32':
    case 'Int64':
      return value;
    case 'Int128':
      return int128ToBigInt(Array.from(value));
    case 'UInt8':
    case 'UInt16':
    case 'UInt32':
    case 'UInt64':
      return value;
    case 'UInt128':
      return int128ToBigInt(Array.from(value));
    case 'Float16':
    case 'Float32':
    case 'Float64':
      return value;
    case 'Decimal16':
    case 'Decimal32':
    case 'Decimal64':
      return new Decimal(value.toString()).dividedBy(
        Math.pow(10, typeDef.places),
      );
    case 'Decimal128': {
      const val = int128ToBigInt(Array.from(value));

      return new Decimal(val.toString()).dividedBy(
        Math.pow(10, typeDef.places),
      );
    }
    case 'Rational8':
    case 'Rational16':
    case 'Rational32':
    case 'Rational64': {
      value = Array.from(value);

      return {
        numerator: value[0],
        denominator: value[1],
      };
    }
    case 'Rational128': {
      value = Array.from(value);

      return {
        numerator: int128ToBigInt(Array.from(value[0])),
        denominator: int128ToBigInt(Array.from(value[1])),
      };
    }
    case 'Constant':
      return typeDef.value;
    case 'Unknown':
      return value;
  }
}

export function getDisplayValue(
  typeDef: RelTypeDef,
  value: RelTypedValue['value'],
): string {
  const val = {
    type: typeDef.type,
    value,
  } as RelTypedValue;

  if (typeDef.type === 'Constant') {
    return typeDef.value;
  }

  switch (val.type) {
    case 'String':
      return JSON.stringify(val.value).slice(1, -1);
    case 'Bool':
      return val.value ? 'true' : 'false';
    case 'Char':
      return val.value;
    case 'DateTime':
      return val.value.toISOString();
    case 'Date':
      return val.value.toISOString().split('T')[0];
    case 'Year':
    case 'Month':
    case 'Week':
    case 'Day':
    case 'Hour':
    case 'Minute':
    case 'Second':
    case 'Millisecond':
    case 'Microsecond':
    case 'Nanosecond':
      return val.value.toString();
    case 'Missing':
      return 'missing';
    case 'FilePos':
      return val.value.toString();
    case 'Hash':
    case 'Int8':
    case 'Int16':
    case 'Int32':
    case 'Int64':
    case 'Int128':
    case 'UInt8':
    case 'UInt16':
    case 'UInt32':
    case 'UInt64':
    case 'UInt128':
      return val.value.toString();
    case 'Float16':
    case 'Float32':
    case 'Float64':
      return val.value % 1 === 0 ? val.value + '.0' : val.value.toString();
    case 'Decimal16':
    case 'Decimal32':
    case 'Decimal64':
    case 'Decimal128':
      return val.value.toFixed(val.places);
    case 'Rational8':
    case 'Rational16':
    case 'Rational32':
    case 'Rational64':
    case 'Rational128':
      return `${val.value.numerator}/${val.value.denominator}`;
    case 'Unknown': {
      const _value = val.value as any;

      return Object.keys(_value)
        .map(key => `${_value[key]}`)
        .join(', ');
    }
  }
}

function int128ToBigInt(tuple: bigint[]) {
  return (BigInt.asIntN(64, tuple[1]) << BigInt(64)) | tuple[0];
}
