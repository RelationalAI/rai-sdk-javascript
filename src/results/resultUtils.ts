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

// Maximum number of precision digits in decimal128 is 39.
Decimal.config({ precision: 40 });

// Rata Die milliseconds for 1970-01-01T00:00:00.
// Date and DateTime types are represented as days and milliseconds
// respectively since 1 AD, following ISO 8601, which is the first
// year in the proleptic Gregorian calendar. JavaScript represents
// Date types as milliseconds since the UNIX epoch.
const UNIXEPOCH = 62135683200000;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function getTypeDefFromProtobuf(type: RelType): RelTypeDef {
  if (
    type.tag === Kind.CONSTANT_TYPE &&
    type.constantType?.value &&
    type.constantType?.relType
  ) {
    const typeDef = getTypeDefFromProtobuf(type.constantType.relType);

    if (typeDef.type !== 'ValueType') {
      const values = type.constantType.value.arguments.map(mapPrimitiveValue);
      const value = convertValue(
        typeDef,
        values.length === 1 ? values[0] : values,
      );

      return {
        type: 'Constant',
        value: {
          ...typeDef,
          value,
        } as RelTypedValue,
      };
    } else {
      const value = unflattenConstantValue(
        typeDef,
        type.constantType.value.arguments,
      );

      return {
        type: 'Constant',
        value: {
          ...typeDef,
          value: convertValue(typeDef, value),
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
    }
  }

  if (type.tag === Kind.VALUE_TYPE && type.valueType) {
    const typeDef: RelTypeDef = {
      type: 'ValueType',
      typeDefs: type.valueType.argumentTypes.map(t =>
        getTypeDefFromProtobuf(t),
      ),
    };

    return mapValueType(typeDef);
  }

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
    case 'AutoNumber':
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
    case 'Constant': {
      return typeDef.value.value;
    }
    case 'ValueType': {
      const physicalTypeDefs = typeDef.typeDefs.filter(
        td => td.type !== 'Constant',
      );
      let val = value?.toArray ? value.toArray() : value;

      // wrapping inlined value type value
      if (physicalTypeDefs.length === 1) {
        val = [val];
      }

      let physicalIndex = -1;

      return typeDef.typeDefs.map(td => {
        if (td.type === 'Constant') {
          return convertValue(td, null);
        } else {
          physicalIndex++;
          return convertValue(td, val[physicalIndex]);
        }
      });
    }
    case 'UUID':
      return toUuid(Array.from(value));
    case 'SHA1': {
      const val = value.toArray ? value.toArray() : value;

      return toSha1(Array.from(val[0]), val[1]);
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
    const displayValue = getDisplayValue(typeDef.value, value);

    if (typeDef.value.type === 'String') {
      // Getting rid of double quotes for string constants
      return displayValue.slice(1, -1);
    }

    return displayValue;
  }

  switch (val.type) {
    case 'String':
    case 'UUID':
    case 'SHA1':
      return JSON.stringify(val.value);
    case 'Bool':
      return val.value ? 'true' : 'false';
    case 'Char':
      return `'${val.value}'`;
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
    case 'AutoNumber':
      return val.value.toString();
    case 'Missing':
      return 'missing';
    case 'Float16':
    case 'Float32':
    case 'Float64': {
      if (Object.is(val.value, -0)) {
        // Displaying negative zero properly
        return '-0.0';
      }

      return val.value % 1 === 0 ? val.value + '.0' : val.value.toString();
    }
    case 'Decimal16':
    case 'Decimal32':
    case 'Decimal64':
    case 'Decimal128':
      return val.value.toFixed(val.places);
    case 'ValueType': {
      const displayValue = val.typeDefs
        .map((td, index) => {
          return getDisplayValue(td, val.value[index]);
        })
        .join(', ');

      return `(${displayValue})`;
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

export function getDisplayName(typeDef: RelTypeDef): string {
  switch (typeDef.type) {
    case 'ValueType': {
      const name = typeDef.typeDefs
        .map(td => {
          if (td.type === 'Constant' && td.value.type === 'String') {
            return td.value.value;
          } else {
            return getDisplayName(td);
          }
        })
        .join(', ');

      return `(${name})`;
    }
    case 'Constant': {
      const name = getDisplayName(typeDef.value);

      return `${name}(${getDisplayValue(typeDef, typeDef.value.value)})`;
    }
    default:
      return typeDef.type;
  }
}

function int128ToBigInt(tuple: bigint[]) {
  return (BigInt.asIntN(64, tuple[1]) << BigInt(64)) | tuple[0];
}

function uint128ToBigInt(tuple: bigint[]) {
  return (BigInt.asUintN(64, tuple[1]) << BigInt(64)) | tuple[0];
}

function toUuid(tuple: bigint[]) {
  const num = uint128ToBigInt(tuple);
  const str = num.toString(16).padStart(32, '0');
  const parts = [
    str.slice(0, 8),
    str.slice(8, 12),
    str.slice(12, 16),
    str.slice(16, 20),
    str.slice(20),
  ];

  return parts.join('-');
}

function toSha1(a: bigint[], b: Number) {
  return (
    uint128ToBigInt(a).toString(16).padStart(32, '0') +
    b.toString(16).padStart(8, '0')
  );
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
    case 'AutoNumber':
    case 'UUID':
    case 'SHA1':
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
  }

  return typeDef;
}

type PValue = ReturnType<typeof mapPrimitiveValue>;
type NestedPrimitiveValue = PValue | NestedPrimitiveValue[];

function unflattenConstantValue(typeDef: RelTypeDef, value: PrimitiveValue[]) {
  const values = value.map(mapPrimitiveValue);
  const res: NestedPrimitiveValue[] = [];

  const walk = (typeDef: RelTypeDef, result: any[]) => {
    switch (typeDef.type) {
      case 'ValueType': {
        const r: any[] = [];
        result.push(r);

        typeDef.typeDefs.forEach(td => walk(td, r));
        break;
      }
      case 'Missing':
        result.push(null);
        break;
      case 'SHA1':
        // These types take 2 values
        result.push(values.splice(0, 2));
        break;
      default: {
        if (typeDef.type !== 'Constant') {
          result.push(values.splice(0, 1)[0]);
        }
      }
    }
  };

  walk(typeDef, res);

  return res[0];
}
