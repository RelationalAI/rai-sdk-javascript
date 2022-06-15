/* eslint-disable */
import Long from 'long';
import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = 'relationalai.protocol';

/** next available: 19 */
export enum PrimitiveType {
  /** UNSPECIFIED_TYPE - https://developers.google.com/protocol-buffers/docs/style#enums */
  UNSPECIFIED_TYPE = 0,
  /** INT_128 - Not present in protobuf, needs two 64-bit ints */
  INT_128 = 1,
  INT_64 = 2,
  INT_32 = 3,
  /** INT_16 - Not present in protobuf */
  INT_16 = 4,
  /** INT_8 - Not present in protobuf */
  INT_8 = 5,
  /** UINT_128 - Not present in protobuf, needs two 64-bit ints */
  UINT_128 = 6,
  UINT_64 = 7,
  UINT_32 = 8,
  /** UINT_16 - Not present in protobuf */
  UINT_16 = 9,
  /** UINT_8 - Not present in protobuf */
  UINT_8 = 10,
  FLOAT_64 = 11,
  FLOAT_32 = 12,
  /** FLOAT_16 - Not present in protobuf */
  FLOAT_16 = 13,
  CHAR = 14,
  BOOL = 15,
  /** STRING - these share the string_val field */
  STRING = 16,
  /** SYMBOL - In protobuf this is really bytes. */
  SYMBOL = 17,
  /**
   * VARIABLE_SIZE_STRING - VariableSizeStrings are not supported as PrimitiveValues, though the type can
   * show up in (internal) type signatures.
   */
  VARIABLE_SIZE_STRING = 18,
  UNRECOGNIZED = -1,
}

export function primitiveTypeFromJSON(object: any): PrimitiveType {
  switch (object) {
    case 0:
    case 'UNSPECIFIED_TYPE':
      return PrimitiveType.UNSPECIFIED_TYPE;
    case 1:
    case 'INT_128':
      return PrimitiveType.INT_128;
    case 2:
    case 'INT_64':
      return PrimitiveType.INT_64;
    case 3:
    case 'INT_32':
      return PrimitiveType.INT_32;
    case 4:
    case 'INT_16':
      return PrimitiveType.INT_16;
    case 5:
    case 'INT_8':
      return PrimitiveType.INT_8;
    case 6:
    case 'UINT_128':
      return PrimitiveType.UINT_128;
    case 7:
    case 'UINT_64':
      return PrimitiveType.UINT_64;
    case 8:
    case 'UINT_32':
      return PrimitiveType.UINT_32;
    case 9:
    case 'UINT_16':
      return PrimitiveType.UINT_16;
    case 10:
    case 'UINT_8':
      return PrimitiveType.UINT_8;
    case 11:
    case 'FLOAT_64':
      return PrimitiveType.FLOAT_64;
    case 12:
    case 'FLOAT_32':
      return PrimitiveType.FLOAT_32;
    case 13:
    case 'FLOAT_16':
      return PrimitiveType.FLOAT_16;
    case 14:
    case 'CHAR':
      return PrimitiveType.CHAR;
    case 15:
    case 'BOOL':
      return PrimitiveType.BOOL;
    case 16:
    case 'STRING':
      return PrimitiveType.STRING;
    case 17:
    case 'SYMBOL':
      return PrimitiveType.SYMBOL;
    case 18:
    case 'VARIABLE_SIZE_STRING':
      return PrimitiveType.VARIABLE_SIZE_STRING;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return PrimitiveType.UNRECOGNIZED;
  }
}

export function primitiveTypeToJSON(object: PrimitiveType): string {
  switch (object) {
    case PrimitiveType.UNSPECIFIED_TYPE:
      return 'UNSPECIFIED_TYPE';
    case PrimitiveType.INT_128:
      return 'INT_128';
    case PrimitiveType.INT_64:
      return 'INT_64';
    case PrimitiveType.INT_32:
      return 'INT_32';
    case PrimitiveType.INT_16:
      return 'INT_16';
    case PrimitiveType.INT_8:
      return 'INT_8';
    case PrimitiveType.UINT_128:
      return 'UINT_128';
    case PrimitiveType.UINT_64:
      return 'UINT_64';
    case PrimitiveType.UINT_32:
      return 'UINT_32';
    case PrimitiveType.UINT_16:
      return 'UINT_16';
    case PrimitiveType.UINT_8:
      return 'UINT_8';
    case PrimitiveType.FLOAT_64:
      return 'FLOAT_64';
    case PrimitiveType.FLOAT_32:
      return 'FLOAT_32';
    case PrimitiveType.FLOAT_16:
      return 'FLOAT_16';
    case PrimitiveType.CHAR:
      return 'CHAR';
    case PrimitiveType.BOOL:
      return 'BOOL';
    case PrimitiveType.STRING:
      return 'STRING';
    case PrimitiveType.SYMBOL:
      return 'SYMBOL';
    case PrimitiveType.VARIABLE_SIZE_STRING:
      return 'VARIABLE_SIZE_STRING';
    case PrimitiveType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum Kind {
  /** UNSPECIFIED_KIND - https://developers.google.com/protocol-buffers/docs/style#enums */
  UNSPECIFIED_KIND = 0,
  PRIMITIVE_TYPE = 1,
  VALUE_TYPE = 2,
  CONSTANT_TYPE = 3,
  UNRECOGNIZED = -1,
}

export function kindFromJSON(object: any): Kind {
  switch (object) {
    case 0:
    case 'UNSPECIFIED_KIND':
      return Kind.UNSPECIFIED_KIND;
    case 1:
    case 'PRIMITIVE_TYPE':
      return Kind.PRIMITIVE_TYPE;
    case 2:
    case 'VALUE_TYPE':
      return Kind.VALUE_TYPE;
    case 3:
    case 'CONSTANT_TYPE':
      return Kind.CONSTANT_TYPE;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Kind.UNRECOGNIZED;
  }
}

export function kindToJSON(object: Kind): string {
  switch (object) {
    case Kind.UNSPECIFIED_KIND:
      return 'UNSPECIFIED_KIND';
    case Kind.PRIMITIVE_TYPE:
      return 'PRIMITIVE_TYPE';
    case Kind.VALUE_TYPE:
      return 'VALUE_TYPE';
    case Kind.CONSTANT_TYPE:
      return 'CONSTANT_TYPE';
    case Kind.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

/** Relations are currently identified by their type signature. */
export interface RelationId {
  arguments: RelType[];
}

/**
 * Renamed from Tuple to avoid collision with julia and python `Tuple`.
 * Value types are flattened into their underlying primitive values.
 */
export interface RelTuple {
  arguments: PrimitiveValue[];
}

/** Named this way to avoid collision with julia's Core.{U,}Int128. */
export interface RelInt128 {
  highbits: number;
  lowbits: number;
}

export interface RelUInt128 {
  highbits: number;
  lowbits: number;
}

/** next available: 18 */
export interface PrimitiveValue {
  /** Type tag indicates which value field is set */
  tag: PrimitiveType;
  /** Not present in protobuf */
  int128Val: RelInt128 | undefined;
  int64Val: number | undefined;
  int32Val: number | undefined;
  /** Not present in protobuf; int32 */
  int16Val: number | undefined;
  /** Not present in protobuf; int32 */
  int8Val: number | undefined;
  /** Not present in protobuf */
  uint128Val: RelUInt128 | undefined;
  uint64Val: number | undefined;
  uint32Val: number | undefined;
  /** Not present in protobuf; uint32 */
  uint16Val: number | undefined;
  /** Not present in protobuf; uint32 */
  uint8Val: number | undefined;
  float64Val: number | undefined;
  float32Val: number | undefined;
  /** Not present in protobuf */
  float16Val: number | undefined;
  charVal: number | undefined;
  boolVal: boolean | undefined;
  /**
   * We use bytes for strings because proto has an encoding
   * requirement for the proto3::string type.
   */
  stringVal: Uint8Array | undefined;
}

export interface ValueType {
  /**
   * Constant types are allowed, e.g. the `64` in `decimal[64]`. They serve as type
   * parameters.
   */
  argumentTypes: RelType[];
}

/** Every value can be used as a type. */
export interface ConstantType {
  /**
   * Required
   * This is the type of the constant and describes whatever is in the RelTuple value
   */
  relType: RelType | undefined;
  /**
   * The tuple contains only the values that are not constant.
   * E.g. for decimal[64](3.14) only 3.14 is part of the data.
   * Required
   *
   * Tuple because of e.g. specialize on Uniform distribution
   */
  value: RelTuple | undefined;
}

/** Union */
export interface RelType {
  tag: Kind;
  /** Only one of the following is allowed. */
  primitiveType: PrimitiveType;
  valueType: ValueType | undefined;
  constantType: ConstantType | undefined;
}

function createBaseRelationId(): RelationId {
  return { arguments: [] };
}

export const RelationId = {
  encode(
    message: RelationId,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.arguments) {
      RelType.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelationId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arguments.push(RelType.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelationId {
    return {
      arguments: Array.isArray(object?.arguments)
        ? object.arguments.map((e: any) => RelType.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RelationId): unknown {
    const obj: any = {};
    if (message.arguments) {
      obj.arguments = message.arguments.map(e =>
        e ? RelType.toJSON(e) : undefined,
      );
    } else {
      obj.arguments = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelationId>, I>>(
    object: I,
  ): RelationId {
    const message = createBaseRelationId();
    message.arguments =
      object.arguments?.map(e => RelType.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRelTuple(): RelTuple {
  return { arguments: [] };
}

export const RelTuple = {
  encode(
    message: RelTuple,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.arguments) {
      PrimitiveValue.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelTuple {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelTuple();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arguments.push(
            PrimitiveValue.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelTuple {
    return {
      arguments: Array.isArray(object?.arguments)
        ? object.arguments.map((e: any) => PrimitiveValue.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RelTuple): unknown {
    const obj: any = {};
    if (message.arguments) {
      obj.arguments = message.arguments.map(e =>
        e ? PrimitiveValue.toJSON(e) : undefined,
      );
    } else {
      obj.arguments = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelTuple>, I>>(object: I): RelTuple {
    const message = createBaseRelTuple();
    message.arguments =
      object.arguments?.map(e => PrimitiveValue.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRelInt128(): RelInt128 {
  return { highbits: 0, lowbits: 0 };
}

export const RelInt128 = {
  encode(
    message: RelInt128,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.highbits !== 0) {
      writer.uint32(8).uint64(message.highbits);
    }
    if (message.lowbits !== 0) {
      writer.uint32(16).uint64(message.lowbits);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelInt128 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelInt128();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.highbits = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.lowbits = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelInt128 {
    return {
      highbits: isSet(object.highbits) ? Number(object.highbits) : 0,
      lowbits: isSet(object.lowbits) ? Number(object.lowbits) : 0,
    };
  },

  toJSON(message: RelInt128): unknown {
    const obj: any = {};
    message.highbits !== undefined &&
      (obj.highbits = Math.round(message.highbits));
    message.lowbits !== undefined &&
      (obj.lowbits = Math.round(message.lowbits));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelInt128>, I>>(
    object: I,
  ): RelInt128 {
    const message = createBaseRelInt128();
    message.highbits = object.highbits ?? 0;
    message.lowbits = object.lowbits ?? 0;
    return message;
  },
};

function createBaseRelUInt128(): RelUInt128 {
  return { highbits: 0, lowbits: 0 };
}

export const RelUInt128 = {
  encode(
    message: RelUInt128,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.highbits !== 0) {
      writer.uint32(8).uint64(message.highbits);
    }
    if (message.lowbits !== 0) {
      writer.uint32(16).uint64(message.lowbits);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelUInt128 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelUInt128();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.highbits = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.lowbits = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelUInt128 {
    return {
      highbits: isSet(object.highbits) ? Number(object.highbits) : 0,
      lowbits: isSet(object.lowbits) ? Number(object.lowbits) : 0,
    };
  },

  toJSON(message: RelUInt128): unknown {
    const obj: any = {};
    message.highbits !== undefined &&
      (obj.highbits = Math.round(message.highbits));
    message.lowbits !== undefined &&
      (obj.lowbits = Math.round(message.lowbits));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelUInt128>, I>>(
    object: I,
  ): RelUInt128 {
    const message = createBaseRelUInt128();
    message.highbits = object.highbits ?? 0;
    message.lowbits = object.lowbits ?? 0;
    return message;
  },
};

function createBasePrimitiveValue(): PrimitiveValue {
  return {
    tag: 0,
    int128Val: undefined,
    int64Val: undefined,
    int32Val: undefined,
    int16Val: undefined,
    int8Val: undefined,
    uint128Val: undefined,
    uint64Val: undefined,
    uint32Val: undefined,
    uint16Val: undefined,
    uint8Val: undefined,
    float64Val: undefined,
    float32Val: undefined,
    float16Val: undefined,
    charVal: undefined,
    boolVal: undefined,
    stringVal: undefined,
  };
}

export const PrimitiveValue = {
  encode(
    message: PrimitiveValue,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.tag !== 0) {
      writer.uint32(8).int32(message.tag);
    }
    if (message.int128Val !== undefined) {
      RelInt128.encode(message.int128Val, writer.uint32(18).fork()).ldelim();
    }
    if (message.int64Val !== undefined) {
      writer.uint32(24).int64(message.int64Val);
    }
    if (message.int32Val !== undefined) {
      writer.uint32(32).int32(message.int32Val);
    }
    if (message.int16Val !== undefined) {
      writer.uint32(40).int32(message.int16Val);
    }
    if (message.int8Val !== undefined) {
      writer.uint32(48).int32(message.int8Val);
    }
    if (message.uint128Val !== undefined) {
      RelUInt128.encode(message.uint128Val, writer.uint32(58).fork()).ldelim();
    }
    if (message.uint64Val !== undefined) {
      writer.uint32(64).uint64(message.uint64Val);
    }
    if (message.uint32Val !== undefined) {
      writer.uint32(72).uint32(message.uint32Val);
    }
    if (message.uint16Val !== undefined) {
      writer.uint32(80).uint32(message.uint16Val);
    }
    if (message.uint8Val !== undefined) {
      writer.uint32(88).uint32(message.uint8Val);
    }
    if (message.float64Val !== undefined) {
      writer.uint32(97).double(message.float64Val);
    }
    if (message.float32Val !== undefined) {
      writer.uint32(109).float(message.float32Val);
    }
    if (message.float16Val !== undefined) {
      writer.uint32(117).float(message.float16Val);
    }
    if (message.charVal !== undefined) {
      writer.uint32(120).uint32(message.charVal);
    }
    if (message.boolVal !== undefined) {
      writer.uint32(128).bool(message.boolVal);
    }
    if (message.stringVal !== undefined) {
      writer.uint32(138).bytes(message.stringVal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PrimitiveValue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrimitiveValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tag = reader.int32() as any;
          break;
        case 2:
          message.int128Val = RelInt128.decode(reader, reader.uint32());
          break;
        case 3:
          message.int64Val = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.int32Val = reader.int32();
          break;
        case 5:
          message.int16Val = reader.int32();
          break;
        case 6:
          message.int8Val = reader.int32();
          break;
        case 7:
          message.uint128Val = RelUInt128.decode(reader, reader.uint32());
          break;
        case 8:
          message.uint64Val = longToNumber(reader.uint64() as Long);
          break;
        case 9:
          message.uint32Val = reader.uint32();
          break;
        case 10:
          message.uint16Val = reader.uint32();
          break;
        case 11:
          message.uint8Val = reader.uint32();
          break;
        case 12:
          message.float64Val = reader.double();
          break;
        case 13:
          message.float32Val = reader.float();
          break;
        case 14:
          message.float16Val = reader.float();
          break;
        case 15:
          message.charVal = reader.uint32();
          break;
        case 16:
          message.boolVal = reader.bool();
          break;
        case 17:
          message.stringVal = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PrimitiveValue {
    return {
      tag: isSet(object.tag) ? primitiveTypeFromJSON(object.tag) : 0,
      int128Val: isSet(object.int128Val)
        ? RelInt128.fromJSON(object.int128Val)
        : undefined,
      int64Val: isSet(object.int64Val) ? Number(object.int64Val) : undefined,
      int32Val: isSet(object.int32Val) ? Number(object.int32Val) : undefined,
      int16Val: isSet(object.int16Val) ? Number(object.int16Val) : undefined,
      int8Val: isSet(object.int8Val) ? Number(object.int8Val) : undefined,
      uint128Val: isSet(object.uint128Val)
        ? RelUInt128.fromJSON(object.uint128Val)
        : undefined,
      uint64Val: isSet(object.uint64Val) ? Number(object.uint64Val) : undefined,
      uint32Val: isSet(object.uint32Val) ? Number(object.uint32Val) : undefined,
      uint16Val: isSet(object.uint16Val) ? Number(object.uint16Val) : undefined,
      uint8Val: isSet(object.uint8Val) ? Number(object.uint8Val) : undefined,
      float64Val: isSet(object.float64Val)
        ? Number(object.float64Val)
        : undefined,
      float32Val: isSet(object.float32Val)
        ? Number(object.float32Val)
        : undefined,
      float16Val: isSet(object.float16Val)
        ? Number(object.float16Val)
        : undefined,
      charVal: isSet(object.charVal) ? Number(object.charVal) : undefined,
      boolVal: isSet(object.boolVal) ? Boolean(object.boolVal) : undefined,
      stringVal: isSet(object.stringVal)
        ? bytesFromBase64(object.stringVal)
        : undefined,
    };
  },

  toJSON(message: PrimitiveValue): unknown {
    const obj: any = {};
    message.tag !== undefined && (obj.tag = primitiveTypeToJSON(message.tag));
    message.int128Val !== undefined &&
      (obj.int128Val = message.int128Val
        ? RelInt128.toJSON(message.int128Val)
        : undefined);
    message.int64Val !== undefined &&
      (obj.int64Val = Math.round(message.int64Val));
    message.int32Val !== undefined &&
      (obj.int32Val = Math.round(message.int32Val));
    message.int16Val !== undefined &&
      (obj.int16Val = Math.round(message.int16Val));
    message.int8Val !== undefined &&
      (obj.int8Val = Math.round(message.int8Val));
    message.uint128Val !== undefined &&
      (obj.uint128Val = message.uint128Val
        ? RelUInt128.toJSON(message.uint128Val)
        : undefined);
    message.uint64Val !== undefined &&
      (obj.uint64Val = Math.round(message.uint64Val));
    message.uint32Val !== undefined &&
      (obj.uint32Val = Math.round(message.uint32Val));
    message.uint16Val !== undefined &&
      (obj.uint16Val = Math.round(message.uint16Val));
    message.uint8Val !== undefined &&
      (obj.uint8Val = Math.round(message.uint8Val));
    message.float64Val !== undefined && (obj.float64Val = message.float64Val);
    message.float32Val !== undefined && (obj.float32Val = message.float32Val);
    message.float16Val !== undefined && (obj.float16Val = message.float16Val);
    message.charVal !== undefined &&
      (obj.charVal = Math.round(message.charVal));
    message.boolVal !== undefined && (obj.boolVal = message.boolVal);
    message.stringVal !== undefined &&
      (obj.stringVal =
        message.stringVal !== undefined
          ? base64FromBytes(message.stringVal)
          : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PrimitiveValue>, I>>(
    object: I,
  ): PrimitiveValue {
    const message = createBasePrimitiveValue();
    message.tag = object.tag ?? 0;
    message.int128Val =
      object.int128Val !== undefined && object.int128Val !== null
        ? RelInt128.fromPartial(object.int128Val)
        : undefined;
    message.int64Val = object.int64Val ?? undefined;
    message.int32Val = object.int32Val ?? undefined;
    message.int16Val = object.int16Val ?? undefined;
    message.int8Val = object.int8Val ?? undefined;
    message.uint128Val =
      object.uint128Val !== undefined && object.uint128Val !== null
        ? RelUInt128.fromPartial(object.uint128Val)
        : undefined;
    message.uint64Val = object.uint64Val ?? undefined;
    message.uint32Val = object.uint32Val ?? undefined;
    message.uint16Val = object.uint16Val ?? undefined;
    message.uint8Val = object.uint8Val ?? undefined;
    message.float64Val = object.float64Val ?? undefined;
    message.float32Val = object.float32Val ?? undefined;
    message.float16Val = object.float16Val ?? undefined;
    message.charVal = object.charVal ?? undefined;
    message.boolVal = object.boolVal ?? undefined;
    message.stringVal = object.stringVal ?? undefined;
    return message;
  },
};

function createBaseValueType(): ValueType {
  return { argumentTypes: [] };
}

export const ValueType = {
  encode(
    message: ValueType,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.argumentTypes) {
      RelType.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValueType {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValueType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.argumentTypes.push(RelType.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValueType {
    return {
      argumentTypes: Array.isArray(object?.argumentTypes)
        ? object.argumentTypes.map((e: any) => RelType.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ValueType): unknown {
    const obj: any = {};
    if (message.argumentTypes) {
      obj.argumentTypes = message.argumentTypes.map(e =>
        e ? RelType.toJSON(e) : undefined,
      );
    } else {
      obj.argumentTypes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ValueType>, I>>(
    object: I,
  ): ValueType {
    const message = createBaseValueType();
    message.argumentTypes =
      object.argumentTypes?.map(e => RelType.fromPartial(e)) || [];
    return message;
  },
};

function createBaseConstantType(): ConstantType {
  return { relType: undefined, value: undefined };
}

export const ConstantType = {
  encode(
    message: ConstantType,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.relType !== undefined) {
      RelType.encode(message.relType, writer.uint32(10).fork()).ldelim();
    }
    if (message.value !== undefined) {
      RelTuple.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConstantType {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConstantType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.relType = RelType.decode(reader, reader.uint32());
          break;
        case 2:
          message.value = RelTuple.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConstantType {
    return {
      relType: isSet(object.relType)
        ? RelType.fromJSON(object.relType)
        : undefined,
      value: isSet(object.value) ? RelTuple.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ConstantType): unknown {
    const obj: any = {};
    message.relType !== undefined &&
      (obj.relType = message.relType
        ? RelType.toJSON(message.relType)
        : undefined);
    message.value !== undefined &&
      (obj.value = message.value ? RelTuple.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConstantType>, I>>(
    object: I,
  ): ConstantType {
    const message = createBaseConstantType();
    message.relType =
      object.relType !== undefined && object.relType !== null
        ? RelType.fromPartial(object.relType)
        : undefined;
    message.value =
      object.value !== undefined && object.value !== null
        ? RelTuple.fromPartial(object.value)
        : undefined;
    return message;
  },
};

function createBaseRelType(): RelType {
  return {
    tag: 0,
    primitiveType: 0,
    valueType: undefined,
    constantType: undefined,
  };
}

export const RelType = {
  encode(
    message: RelType,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.tag !== 0) {
      writer.uint32(8).int32(message.tag);
    }
    if (message.primitiveType !== 0) {
      writer.uint32(16).int32(message.primitiveType);
    }
    if (message.valueType !== undefined) {
      ValueType.encode(message.valueType, writer.uint32(26).fork()).ldelim();
    }
    if (message.constantType !== undefined) {
      ConstantType.encode(
        message.constantType,
        writer.uint32(34).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelType {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tag = reader.int32() as any;
          break;
        case 2:
          message.primitiveType = reader.int32() as any;
          break;
        case 3:
          message.valueType = ValueType.decode(reader, reader.uint32());
          break;
        case 4:
          message.constantType = ConstantType.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelType {
    return {
      tag: isSet(object.tag) ? kindFromJSON(object.tag) : 0,
      primitiveType: isSet(object.primitiveType)
        ? primitiveTypeFromJSON(object.primitiveType)
        : 0,
      valueType: isSet(object.valueType)
        ? ValueType.fromJSON(object.valueType)
        : undefined,
      constantType: isSet(object.constantType)
        ? ConstantType.fromJSON(object.constantType)
        : undefined,
    };
  },

  toJSON(message: RelType): unknown {
    const obj: any = {};
    message.tag !== undefined && (obj.tag = kindToJSON(message.tag));
    message.primitiveType !== undefined &&
      (obj.primitiveType = primitiveTypeToJSON(message.primitiveType));
    message.valueType !== undefined &&
      (obj.valueType = message.valueType
        ? ValueType.toJSON(message.valueType)
        : undefined);
    message.constantType !== undefined &&
      (obj.constantType = message.constantType
        ? ConstantType.toJSON(message.constantType)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelType>, I>>(object: I): RelType {
    const message = createBaseRelType();
    message.tag = object.tag ?? 0;
    message.primitiveType = object.primitiveType ?? 0;
    message.valueType =
      object.valueType !== undefined && object.valueType !== null
        ? ValueType.fromPartial(object.valueType)
        : undefined;
    message.constantType =
      object.constantType !== undefined && object.constantType !== null
        ? ConstantType.fromPartial(object.constantType)
        : undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw 'Unable to locate global object';
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  (b64 => globalThis.Buffer.from(b64, 'base64').toString('binary'));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  (bin => globalThis.Buffer.from(bin, 'binary').toString('base64'));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  arr.forEach(byte => {
    bin.push(String.fromCharCode(byte));
  });
  return btoa(bin.join(''));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
