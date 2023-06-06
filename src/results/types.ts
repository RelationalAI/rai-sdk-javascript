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

export type RelPrimitiveTypedValue =
  | StringValue
  | BoolValue
  | CharValue
  | Int8Value
  | Int16Value
  | Int32Value
  | Int64Value
  | Int128Value
  | UInt8Value
  | UInt16Value
  | UInt32Value
  | UInt64Value
  | UInt128Value
  | Float16Value
  | Float32Value
  | Float64Value;

export type RelBaseTypedValue =
  | RelPrimitiveTypedValue
  | DateTimeValue
  | DateValue
  | YearValue
  | MonthValue
  | WeekValue
  | DayValue
  | HourValue
  | MinuteValue
  | SecondValue
  | MillisecondValue
  | MicrosecondValue
  | NanosecondValue
  | HashValue
  | MissingValue
  | FilePosValue
  | Decimal16Value
  | Decimal32Value
  | Decimal64Value
  | Decimal128Value
  | Rational8Value
  | Rational16Value
  | Rational32Value
  | Rational64Value
  | Rational128Value
  | AutoNumber
  | UUID;

export type RelTypedValue = RelBaseTypedValue | ValueTypeValue | UnknownType;

export type RelTypeDef =
  | Omit<StringValue, 'value'>
  | Omit<BoolValue, 'value'>
  | Omit<CharValue, 'value'>
  | Omit<DateTimeValue, 'value'>
  | Omit<DateValue, 'value'>
  | Omit<YearValue, 'value'>
  | Omit<MonthValue, 'value'>
  | Omit<WeekValue, 'value'>
  | Omit<DayValue, 'value'>
  | Omit<HourValue, 'value'>
  | Omit<MinuteValue, 'value'>
  | Omit<SecondValue, 'value'>
  | Omit<MillisecondValue, 'value'>
  | Omit<MicrosecondValue, 'value'>
  | Omit<NanosecondValue, 'value'>
  | Omit<HashValue, 'value'>
  | Omit<MissingValue, 'value'>
  | Omit<FilePosValue, 'value'>
  | Omit<Int8Value, 'value'>
  | Omit<Int16Value, 'value'>
  | Omit<Int32Value, 'value'>
  | Omit<Int64Value, 'value'>
  | Omit<Int128Value, 'value'>
  | Omit<UInt8Value, 'value'>
  | Omit<UInt16Value, 'value'>
  | Omit<UInt32Value, 'value'>
  | Omit<UInt64Value, 'value'>
  | Omit<UInt128Value, 'value'>
  | Omit<Float16Value, 'value'>
  | Omit<Float32Value, 'value'>
  | Omit<Float64Value, 'value'>
  | Omit<Decimal16Value, 'value'>
  | Omit<Decimal32Value, 'value'>
  | Omit<Decimal64Value, 'value'>
  | Omit<Decimal128Value, 'value'>
  | Omit<Rational8Value, 'value'>
  | Omit<Rational16Value, 'value'>
  | Omit<Rational32Value, 'value'>
  | Omit<Rational64Value, 'value'>
  | Omit<Rational128Value, 'value'>
  | Omit<AutoNumber, 'value'>
  | Omit<UUID, 'value'>
  | ConstantValue
  | Omit<ValueTypeValue, 'value'>
  | Omit<UnknownType, 'value'>;

export type ConstantValue = {
  type: 'Constant';
  value: RelTypedValue;
};

export type ValueTypeValue = {
  type: 'ValueType';
  typeDefs: RelTypeDef[];
  value: (RelBaseTypedValue['value'] | RelBaseTypedValue['value'][])[];
};

export type StringValue = {
  type: 'String';
  value: string;
};

export type BoolValue = {
  type: 'Bool';
  value: boolean;
};

export type CharValue = {
  type: 'Char';
  value: string;
};

export type DateTimeValue = {
  type: 'DateTime';
  value: Date;
};

export type DateValue = {
  type: 'Date';
  value: Date;
};

export type YearValue = {
  type: 'Year';
  value: bigint;
};

export type MonthValue = {
  type: 'Month';
  value: bigint;
};

export type WeekValue = {
  type: 'Week';
  value: bigint;
};

export type DayValue = {
  type: 'Day';
  value: bigint;
};

export type HourValue = {
  type: 'Hour';
  value: bigint;
};

export type MinuteValue = {
  type: 'Minute';
  value: bigint;
};

export type SecondValue = {
  type: 'Second';
  value: bigint;
};

export type MillisecondValue = {
  type: 'Millisecond';
  value: bigint;
};

export type MicrosecondValue = {
  type: 'Microsecond';
  value: bigint;
};

export type NanosecondValue = {
  type: 'Nanosecond';
  value: bigint;
};

export type HashValue = {
  type: 'Hash';
  value: bigint;
};

export type MissingValue = {
  type: 'Missing';
  value: null;
};

export type FilePosValue = {
  type: 'FilePos';
  value: bigint;
};

export type Int8Value = {
  type: 'Int8';
  value: number;
};

export type Int16Value = {
  type: 'Int16';
  value: number;
};

export type Int32Value = {
  type: 'Int32';
  value: number;
};

export type Int64Value = {
  type: 'Int64';
  value: bigint;
};

export type Int128Value = {
  type: 'Int128';
  value: bigint;
};

export type UInt8Value = {
  type: 'UInt8';
  value: number;
};

export type UInt16Value = {
  type: 'UInt16';
  value: number;
};

export type UInt32Value = {
  type: 'UInt32';
  value: number;
};

export type UInt64Value = {
  type: 'UInt64';
  value: bigint;
};

export type UInt128Value = {
  type: 'UInt128';
  value: bigint;
};

export type Float16Value = {
  type: 'Float16';
  value: number;
};

export type Float32Value = {
  type: 'Float32';
  value: number;
};

export type Float64Value = {
  type: 'Float64';
  value: number;
};

export type Decimal16Value = {
  type: 'Decimal16';
  value: Decimal;
  places: number;
};

export type Decimal32Value = {
  type: 'Decimal32';
  value: Decimal;
  places: number;
};

export type Decimal64Value = {
  type: 'Decimal64';
  value: Decimal;
  places: number;
};

export type Decimal128Value = {
  type: 'Decimal128';
  value: Decimal;
  places: number;
};

export type Rational8Value = {
  type: 'Rational8';
  value: {
    numerator: number;
    denominator: number;
  };
};

export type Rational16Value = {
  type: 'Rational16';
  value: {
    numerator: number;
    denominator: number;
  };
};

export type Rational32Value = {
  type: 'Rational32';
  value: {
    numerator: number;
    denominator: number;
  };
};

export type Rational64Value = {
  type: 'Rational64';
  value: {
    numerator: bigint;
    denominator: bigint;
  };
};

export type Rational128Value = {
  type: 'Rational128';
  value: {
    numerator: bigint;
    denominator: bigint;
  };
};

export type AutoNumber = {
  type: 'AutoNumber';
  value: bigint;
};

export type UUID = {
  type: 'UUID';
  value: string;
};

// TODO: should be removed with JSON based metadata implementation?
export type UnknownType = {
  type: 'Unknown';
  value: Record<string, any>;
};
