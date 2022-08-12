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

import {
  Kind,
  PrimitiveType,
  PrimitiveValue,
  RelType,
} from '../proto/generated/schema';
import {
  ConstantValue,
  RelTypeDef,
  RelTypedValue,
  ValueTypeValue,
} from './types';

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
      value: { type: 'String', value: type },
    };
  }

  if (type.includes('(') && !type.startsWith('(')) {
    return {
      type: 'Constant',
      name: type,
      value: { type: 'String', value: type },
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

export function getTypeDefFromProtobuf(type: RelType): RelTypeDef {
  if (
    type.tag === Kind.CONSTANT_TYPE &&
    type.constantType?.value &&
    type.constantType?.relType
  ) {
    const typeDef = getTypeDefFromProtobuf(type.constantType.relType);
    const values = type.constantType.value.arguments.map(mapPrimitiveValue);

    if (typeDef.type !== 'ValueType') {
      const value = convertValue(
        typeDef,
        values.length === 1 ? values[0] : values,
      );

      return {
        type: 'Constant',
        name:
          typeDef.type === 'String'
            ? 'Symbol'
            : `${typeDef.type}(${getDisplayValue(typeDef, value)})`,
        value: {
          ...typeDef,
          value,
        } as RelTypedValue,
      };
    } else {
      // TODO fix it, this won't work for nested value types
      const value = convertValue(typeDef, values);

      return {
        type: 'Constant',
        name: 'ValueType',
        value: {
          ...typeDef,
          value,
        } as RelTypedValue,
      };
    }
  }

  if (type.tag === Kind.PRIMITIVE_TYPE) {
    switch (type.primitiveType) {
      case PrimitiveType.SYMBOL:
      case PrimitiveType.STRING:
        return {
          type: 'String',
        };
      case PrimitiveType.CHAR:
        return {
          type: 'Char',
        };
      case PrimitiveType.BOOL:
        return {
          type: 'Bool',
        };
      case PrimitiveType.INT_8:
        return {
          type: 'Int8',
        };
      case PrimitiveType.INT_16:
        return {
          type: 'Int16',
        };
      case PrimitiveType.INT_32:
        return {
          type: 'Int32',
        };
      case PrimitiveType.INT_64:
        return {
          type: 'Int64',
        };
      case PrimitiveType.INT_128:
        return {
          type: 'Int128',
        };
      case PrimitiveType.UINT_8:
        return {
          type: 'UInt8',
        };
      case PrimitiveType.UINT_16:
        return {
          type: 'UInt16',
        };
      case PrimitiveType.UINT_32:
        return {
          type: 'UInt32',
        };
      case PrimitiveType.UINT_64:
        return {
          type: 'UInt64',
        };
      case PrimitiveType.UINT_128:
        return {
          type: 'UInt128',
        };
      case PrimitiveType.FLOAT_16:
        return {
          type: 'Float16',
        };
      case PrimitiveType.FLOAT_32:
        return {
          type: 'Float32',
        };
      case PrimitiveType.FLOAT_64:
        return {
          type: 'Float64',
        };
      // TODO should we throw an error here?
    }
  }

  if (type.tag === Kind.VALUE_TYPE && type.valueType) {
    const typeDef = {
      type: 'ValueType',
      // TODO add name?
      typeDefs: type.valueType.argumentTypes.map(t =>
        getTypeDefFromProtobuf(t),
      ),
    } as const;

    return mapValueType(typeDef);
  }

  // TODO should we keep it or just throw an error?
  return {
    type: 'Unknown',
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
      return uint128ToBigInt(Array.from(value));
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
      return uint128ToBigInt(Array.from(value));
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
    case 'Constant': {
      return typeDef.value.value;
    }
    case 'ValueType': {
      const nonConstantTypeDefs = typeDef.typeDefs.filter(
        td => td.type !== 'Constant',
      );
      let val = value?.toArray ? value.toArray() : value;

      // TODO add explanation comment
      // inlined value types? is that the proper term?
      if (nonConstantTypeDefs.length === 1) {
        val = [val];
      }

      return nonConstantTypeDefs.map((td, index) => {
        return convertValue(td, val[index]);
      });
    }
    case 'Unknown':
      return value && value.toJSON ? value.toJSON() : value;
  }
}

export function getDisplayValue(
  typeDef: RelTypeDef,
  value: RelTypedValue['value'],
): string {
  const val = {
    ...typeDef,
    value,
  } as RelTypedValue;

  if (typeDef.type === 'Constant') {
    return getDisplayValue(typeDef.value, value);
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
    case 'FilePos':
    case 'Hash':
      return val.value.toString();
    case 'Missing':
      return 'missing';
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
    case 'ValueType': {
      const nonConstantTypeDefs = val.typeDefs.filter(
        td => td.type !== 'Constant',
      );

      return nonConstantTypeDefs
        .map((td, index) => {
          const displayValue = getDisplayValue(td, val.value[index]);

          return td.type === 'ValueType' ? `(${displayValue})` : displayValue;
        })
        .join(', ');
    }
    case 'Unknown': {
      const _value = val.value as any;

      if (typeof _value === 'object') {
        return Object.keys(_value)
          .map(key => `${_value[key]}`)
          .join(', ');
      }

      // probably inlined value type
      return _value;
    }
  }
}

function int128ToBigInt(tuple: bigint[]) {
  return (BigInt.asIntN(64, tuple[1]) << BigInt(64)) | tuple[0];
}

function uint128ToBigInt(tuple: bigint[]) {
  return (BigInt.asUintN(64, tuple[1]) << BigInt(64)) | tuple[0];
}

function mapPrimitiveValue(val: PrimitiveValue) {
  switch (val.value.oneofKind) {
    case 'stringVal':
      return `:${new TextDecoder().decode(val.value.stringVal)}`;
    case 'charVal':
      return val.value.charVal;
    case 'boolVal':
      return val.value.boolVal;
    case 'int8Val':
      return val.value.int8Val;
    case 'int16Val':
      return val.value.int16Val;
    case 'int32Val':
      return val.value.int32Val;
    case 'int64Val':
      return val.value.int64Val;
    case 'int128Val':
      return [val.value.int128Val.lowbits, val.value.int128Val.highbits];
    case 'uint8Val':
      return val.value.uint8Val;
    case 'uint16Val':
      return val.value.uint16Val;
    case 'uint32Val':
      return val.value.uint32Val;
    case 'uint64Val':
      return val.value.uint64Val;
    case 'uint128Val':
      return [val.value.uint128Val.lowbits, val.value.uint128Val.highbits];
    case 'float16Val':
      return val.value.float16Val;
    case 'float32Val':
      return val.value.float32Val;
    case 'float64Val':
      return val.value.float64Val;
  }

  throw new Error('Unknown primitive value');
}

function mapValueType(typeDef: Omit<ValueTypeValue, 'value'>): RelTypeDef {
  const relNames = typeDef.typeDefs
    .slice(0, 3)
    .filter(
      td => td.type === 'Constant' && td.value.type === 'String',
    ) as ConstantValue[];

  if (
    relNames.length !== 3 ||
    !(relNames[0].value.value === ':rel' && relNames[1].value.value === ':base')
  ) {
    return typeDef;
  }

  const standardValueType = (relNames[2].value.value as string).slice(1);

  switch (standardValueType) {
    case 'DateTime':
    case 'Date':
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
    case 'FilePos':
    case 'Missing':
    case 'Hash':
      return {
        type: standardValueType,
      };
    case 'FixedDecimal': {
      if (
        typeDef.typeDefs.length === 6 &&
        typeDef.typeDefs[3].type === 'Constant' &&
        typeDef.typeDefs[4].type === 'Constant'
      ) {
        const bits = Number(typeDef.typeDefs[3].value.value);
        const places = Number(typeDef.typeDefs[4].value.value);

        if (bits === 16 || bits === 32 || bits === 64 || bits === 128) {
          return {
            type: `Decimal${bits}`,
            places: places,
          };
        }
      }
      break;
    }
    case 'Rational': {
      if (
        typeDef.typeDefs.length === 4 &&
        typeDef.typeDefs[3].type === 'ValueType'
      ) {
        const tp = typeDef.typeDefs[3];

        if (tp.typeDefs.length === 2) {
          switch (tp.typeDefs[0].type) {
            case 'Int8':
              return { type: 'Rational8' };
            case 'Int16':
              return { type: 'Rational16' };
            case 'Int32':
              return { type: 'Rational32' };
            case 'Int64':
              return { type: 'Rational64' };
            case 'Int128':
              return { type: 'Rational128' };
          }
        }
      }
    }
  }

  return typeDef;
}
