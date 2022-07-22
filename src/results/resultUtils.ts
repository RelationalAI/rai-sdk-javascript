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

import { RelBaseValue } from './types';

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

// TODO should return type like:
// type Value = {
//   kind: RelTypesEnumHere;
//   value: ConditionalValueHere;
// };
export function toJsValue(value: any, type: string): RelBaseValue {
  if (type === 'String') {
    return {
      type: 'String',
      value: value,
    };
  }

  if (type === 'Bool') {
    return {
      type: 'Bool',
      value: value,
    };
  }

  if (type === 'Char') {
    return {
      type: 'Char',
      value: String.fromCodePoint(value),
    };
  }

  if (type === 'Dates.DateTime') {
    return {
      type: 'DateTime',
      value: new Date(Number(value) - UNIXEPOCH),
    };
  }

  if (type === 'Dates.Date') {
    return {
      type: 'Date',
      value: new Date(Number(value) * MILLISECONDS_PER_DAY - UNIXEPOCH),
    };
  }

  if (type === 'HashValue') {
    return {
      type: 'Hash',
      value: int128ToBigInt(value.toArray()),
    };
  }

  if (type === 'Missing') {
    return {
      type: 'Missing',
      value: null,
    };
  }

  const intMatch = type.match(intRegEx);

  if (intMatch && intMatch.length === 2) {
    const bits = intMatch[1];
    const type = `Int${bits}`;

    return {
      type: type as any,
      value: bits === '128' ? int128ToBigInt(value.toArray()) : value,
    };
  }

  const uintMatch = type.match(uintRegEx);

  if (uintMatch && uintMatch.length === 2) {
    const bits = uintMatch[1];
    return {
      type: `UInt${bits}` as any,
      value: bits === '128' ? int128ToBigInt(value.toArray()) : value,
    };
  }

  const floatMatch = type.match(floatRegEx);

  if (floatMatch && floatMatch.length === 2) {
    const bits = floatMatch[1];

    return {
      type: `Float${bits}` as any,
      value: value,
    };
  }

  const decimalMatch = type.match(decimalRegEx);

  if (decimalMatch && decimalMatch.length === 3) {
    const bits = Number.parseInt(decimalMatch[1]);
    const places = Number.parseInt(decimalMatch[2]);

    if (bits === 128) {
      value = int128ToBigInt(value.toArray());
    }

    // Decimal.js doesn't support BigInt
    // See: https://github.com/MikeMcl/decimal.js/issues/181
    value = new Decimal(value.toString()).dividedBy(Math.pow(10, places));

    return {
      type: `Decimal${bits}` as any,
      value: value,
      places,
    };
  }

  const rationalMatch = type.match(rationalRegEx);

  if (rationalMatch && rationalMatch.length === 2) {
    value = value.toArray();
    const bits = rationalMatch[1];

    return {
      type: `Rational${bits}` as any,
      value: {
        numerator:
          bits === '128' ? int128ToBigInt(value[0].toArray()) : value[0],
        denominator:
          bits === '128' ? int128ToBigInt(value[1].toArray()) : value[1],
      },
    };
  }

  return {
    type: 'Unknown',
    value: value,
  };
}

export function toDisplayValue(val: RelBaseValue): string {
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
    case 'Missing':
      return 'missing';
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
    case 'Unknown':
      return Object.keys(val.value)
        .map(key => `${val.value[key]}`)
        .join(', ');
  }
}

function int128ToBigInt(tuple: bigint[]) {
  return (BigInt.asIntN(64, tuple[1]) << BigInt(64)) | tuple[0];
}
