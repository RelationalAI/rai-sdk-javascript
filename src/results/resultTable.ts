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

import { StructRowProxy, Table } from 'apache-arrow';

import { TransactionMetadata } from '../api/transaction/types';

export class ResultTable {
  constructor(private table: Table, private metadata: TransactionMetadata) {}

  // TODO colNums
  // TODO rowNums

  get rows() {
    // Getting rid of constant types
    // /:bar/String/(:Foo, Int64) -> ["String", "(:Foo, Int64)"]
    // /Int64(1)/Float64 -> ["Float64"]
    const columnTypes = this.metadata.types.filter(type => {
      return (
        !type.startsWith(':') && (!type.includes('(') || type.startsWith('('))
      );
    });

    if (columnTypes.length !== this.table.numCols) {
      throw new Error(`Column number mismatch ${this.metadata.relationId}`);
    }

    return this.table.toArray().map(row => new ResultRow(row, columnTypes));
  }

  toJS(format: CellToJsFormat = 'value') {
    return this.rows.map(row => {
      return row.toJS(format);
    });
  }
}

export type CellToJsFormat = 'cell' | 'value' | 'displayValue' | 'rawValue';

class ResultRow {
  constructor(private row: StructRowProxy, private columnTypes: string[]) {}

  toArray() {
    return this.row.toArray().map((cell, index) => {
      return new ResultCell(cell, this.columnTypes[index]);
    });
  }

  toJS(format: CellToJsFormat = 'value') {
    // TODO fix return type
    return this.toArray().reduce<Record<string, any>>((memo, cell) => {
      if (format === 'cell') {
        memo[cell.type] = cell;
      } else {
        memo[cell.type] = cell[format];
      }

      return memo;
    }, {});
  }
}

// :foo, Int64, String

class ResultCell {
  constructor(private arrowValue: any, public type: string) {}

  get rawValue() {
    return this.arrowValue;
  }

  get value() {
    return toJsValue(this.arrowValue, this.type);
  }

  get displayValue() {
    return toDisplayValue(this.value, this.type);
  }
}

// Rata Die milliseconds for 1970-01-01T00:00:00.
// Date and DateTime types are represented as days and milliseconds
// respectively since 1 AD, following ISO 8601, which is the first
// year in the proleptic Gregorian calendar. JavaScript represents
// Date types as milliseconds since the UNIX epoch.
const UNIXEPOCH = 62135683200000;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const intRegEx = /^U?Int(\d+)$/;
const floatRegEx = /^Float\d+$/;
const decimalRegEx = /^FixedPointDecimals.FixedDecimal{Int(\d+), (\d+)}$/;
const rationalRegEx = /^Rational{Int(\d+)}$/;

// TODO should return type like:
// type Value = {
//   kind: RelTypesEnumHere;
//   value: ConditionalValueHere;
// };
function toJsValue(value: any, type: string) {
  if (type === 'String') {
    return value;
  }

  if (type === 'Bool') {
    return value;
  }

  if (type === 'Char') {
    return String.fromCodePoint(value);
  }

  if (type === 'Dates.DateTime') {
    return new Date(Number(value) - UNIXEPOCH);
  }

  if (type === 'Dates.Date') {
    return new Date(Number(value) * MILLISECONDS_PER_DAY - UNIXEPOCH);
  }

  if (type === 'RelationalAITypes.HashValue') {
    return int128ToBigInt(value);
  }

  if (type === 'Missing') {
    return null;
  }

  const intMatch = type.match(intRegEx);

  if (intMatch && intMatch.length === 2) {
    const bits = intMatch[1];

    if (bits === '128') {
      return int128ToBigInt(value.toArray());
    } else {
      return value;
    }
  }

  const floatMatch = type.match(floatRegEx);

  if (floatMatch) {
    return value;
  }

  const decimalMatch = type.match(decimalRegEx);

  if (decimalMatch && decimalMatch.length === 3) {
    const bits = Number.parseInt(decimalMatch[1]);
    const places = Number.parseInt(decimalMatch[2]);

    // TODO use decimal.js or something like that

    if (bits < 64) {
      return value / Math.pow(10, places);
    }

    if (bits === 128) {
      value = int128ToBigInt(value.toArray());
    }

    // TODO this won't work, really use decimal.js!
    return value / BigInt(Math.pow(10, places));
  }

  // rationals
  const rationalMatch = type.match(rationalRegEx);

  if (rationalMatch && rationalMatch.length === 2) {
    value = value.toArray();
    const bits = rationalMatch[1];

    // TODO add Type for Rational
    if (bits === '128') {
      return {
        numerator: int128ToBigInt(value[0].toArray()),
        denominator: int128ToBigInt(value[1].toArray()),
      };
    } else {
      return {
        numerator: value[0],
        denominator: value[1],
      };
    }
  }

  // TODO unknown type?
  return value;
}

function toDisplayValue(value: any, type: string): string {
  if (type === 'String') {
    return JSON.stringify(value).slice(1, -1);
  }

  if (type === 'Bool') {
    return value ? 'true' : 'false';
  }

  if (type === 'Char') {
    return value;
  }

  if (type === 'Dates.DateTime') {
    return value.toISOString();
  }

  if (type === 'Dates.Date') {
    const isoStr = value.toISOString();

    return isoStr.split('T')[0];
  }

  if (type === 'RelationalAITypes.HashValue') {
    return value.toString();
  }

  if (type === 'Missing') {
    return 'missing';
  }

  if (intRegEx.test(type)) {
    return value.toString();
  }

  if (floatRegEx.test(type)) {
    return value.toString();
  }

  const decimalMatch = type.match(decimalRegEx);

  if (decimalMatch && decimalMatch.length === 3) {
    // const bits = Number.parseInt(decimalMatch[1]);
    // const places = Number.parseInt(decimalMatch[2]);

    // TODO check with decimal.js
    return value.toString();
  }

  if (rationalRegEx.test(type)) {
    return `${value.numerator}/${value.denominator}`;
  }

  // TODO unknown type? figure this out
  if (typeof value === 'object') {
    return Object.keys(value)
      .map(key => `${key}: ${value[key]}`)
      .join(', ');
  }

  // fall through
  return value.toString();
}

function int128ToBigInt(tuple: bigint[]) {
  return (BigInt.asIntN(64, tuple[1]) << BigInt(64)) | tuple[0];
}
