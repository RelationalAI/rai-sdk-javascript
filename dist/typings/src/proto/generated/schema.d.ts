import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * Relations are currently identified by their type signature.
 *
 * @generated from protobuf message relationalai.protocol.RelationId
 */
export interface RelationId {
    /**
     * @generated from protobuf field: repeated relationalai.protocol.RelType arguments = 1;
     */
    arguments: RelType[];
}
/**
 * Renamed from Tuple to avoid collision with julia and python `Tuple`.
 * Value types are flattened into their underlying primitive values.
 *
 * @generated from protobuf message relationalai.protocol.RelTuple
 */
export interface RelTuple {
    /**
     * @generated from protobuf field: repeated relationalai.protocol.PrimitiveValue arguments = 1;
     */
    arguments: PrimitiveValue[];
}
/**
 * Named this way to avoid collision with julia's Core.{U,}Int128.
 *
 * @generated from protobuf message relationalai.protocol.RelInt128
 */
export interface RelInt128 {
    /**
     * @generated from protobuf field: uint64 highbits = 1;
     */
    highbits: bigint;
    /**
     * @generated from protobuf field: uint64 lowbits = 2;
     */
    lowbits: bigint;
}
/**
 * @generated from protobuf message relationalai.protocol.RelUInt128
 */
export interface RelUInt128 {
    /**
     * @generated from protobuf field: uint64 highbits = 1;
     */
    highbits: bigint;
    /**
     * @generated from protobuf field: uint64 lowbits = 2;
     */
    lowbits: bigint;
}
/**
 * next available: 18
 *
 * @generated from protobuf message relationalai.protocol.PrimitiveValue
 */
export interface PrimitiveValue {
    /**
     * Type tag indicates which value field is set
     *
     * @generated from protobuf field: relationalai.protocol.PrimitiveType tag = 1;
     */
    tag: PrimitiveType;
    /**
     * @generated from protobuf oneof: value
     */
    value: {
        oneofKind: "int128Val";
        /**
         * @generated from protobuf field: relationalai.protocol.RelInt128 int128_val = 2;
         */
        int128Val: RelInt128;
    } | {
        oneofKind: "int64Val";
        /**
         * @generated from protobuf field: int64 int64_val = 3;
         */
        int64Val: bigint;
    } | {
        oneofKind: "int32Val";
        /**
         * @generated from protobuf field: int32 int32_val = 4;
         */
        int32Val: number;
    } | {
        oneofKind: "int16Val";
        /**
         * @generated from protobuf field: int32 int16_val = 5;
         */
        int16Val: number;
    } | {
        oneofKind: "int8Val";
        /**
         * @generated from protobuf field: int32 int8_val = 6;
         */
        int8Val: number;
    } | {
        oneofKind: "uint128Val";
        /**
         * @generated from protobuf field: relationalai.protocol.RelUInt128 uint128_val = 7;
         */
        uint128Val: RelUInt128;
    } | {
        oneofKind: "uint64Val";
        /**
         * @generated from protobuf field: uint64 uint64_val = 8;
         */
        uint64Val: bigint;
    } | {
        oneofKind: "uint32Val";
        /**
         * @generated from protobuf field: uint32 uint32_val = 9;
         */
        uint32Val: number;
    } | {
        oneofKind: "uint16Val";
        /**
         * @generated from protobuf field: uint32 uint16_val = 10;
         */
        uint16Val: number;
    } | {
        oneofKind: "uint8Val";
        /**
         * @generated from protobuf field: uint32 uint8_val = 11;
         */
        uint8Val: number;
    } | {
        oneofKind: "float64Val";
        /**
         * @generated from protobuf field: double float64_val = 12;
         */
        float64Val: number;
    } | {
        oneofKind: "float32Val";
        /**
         * @generated from protobuf field: float float32_val = 13;
         */
        float32Val: number;
    } | {
        oneofKind: "float16Val";
        /**
         * @generated from protobuf field: float float16_val = 14;
         */
        float16Val: number;
    } | {
        oneofKind: "charVal";
        /**
         * @generated from protobuf field: uint32 char_val = 15;
         */
        charVal: number;
    } | {
        oneofKind: "boolVal";
        /**
         * @generated from protobuf field: bool bool_val = 16;
         */
        boolVal: boolean;
    } | {
        oneofKind: "stringVal";
        /**
         * We use bytes for strings because proto has an encoding
         * requirement for the proto3::string type.
         *
         * @generated from protobuf field: bytes string_val = 17;
         */
        stringVal: Uint8Array;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message relationalai.protocol.ValueType
 */
export interface ValueType {
    /**
     * Constant types are allowed, e.g. the `64` in `decimal[64]`. They serve as type
     * parameters.
     *
     * @generated from protobuf field: repeated relationalai.protocol.RelType argument_types = 1;
     */
    argumentTypes: RelType[];
}
/**
 * Every value can be used as a type.
 *
 * @generated from protobuf message relationalai.protocol.ConstantType
 */
export interface ConstantType {
    /**
     * Required
     * This is the type of the constant and describes whatever is in the RelTuple value
     *
     * @generated from protobuf field: relationalai.protocol.RelType rel_type = 1;
     */
    relType?: RelType;
    /**
     * The tuple contains only the values that are not constant.
     * E.g. for decimal[64](3.14) only 3.14 is part of the data.
     * Required
     *
     * Tuple because of e.g. specialize on Uniform distribution
     *
     * @generated from protobuf field: relationalai.protocol.RelTuple value = 2;
     */
    value?: RelTuple;
}
/**
 * Union
 *
 * @generated from protobuf message relationalai.protocol.RelType
 */
export interface RelType {
    /**
     * @generated from protobuf field: relationalai.protocol.Kind tag = 1;
     */
    tag: Kind;
    /**
     * Only one of the following is allowed.
     *
     * @generated from protobuf field: relationalai.protocol.PrimitiveType primitive_type = 2;
     */
    primitiveType: PrimitiveType;
    /**
     * @generated from protobuf field: relationalai.protocol.ValueType value_type = 3;
     */
    valueType?: ValueType;
    /**
     * @generated from protobuf field: relationalai.protocol.ConstantType constant_type = 4;
     */
    constantType?: ConstantType;
}
/**
 * next available: 19
 *
 * @generated from protobuf enum relationalai.protocol.PrimitiveType
 */
export declare enum PrimitiveType {
    /**
     * https://developers.google.com/protocol-buffers/docs/style#enums
     *
     * @generated from protobuf enum value: UNSPECIFIED_TYPE = 0;
     */
    UNSPECIFIED_TYPE = 0,
    /**
     * Not present in protobuf, needs two 64-bit ints
     *
     * @generated from protobuf enum value: INT_128 = 1;
     */
    INT_128 = 1,
    /**
     * @generated from protobuf enum value: INT_64 = 2;
     */
    INT_64 = 2,
    /**
     * @generated from protobuf enum value: INT_32 = 3;
     */
    INT_32 = 3,
    /**
     * Not present in protobuf
     *
     * @generated from protobuf enum value: INT_16 = 4;
     */
    INT_16 = 4,
    /**
     * Not present in protobuf
     *
     * @generated from protobuf enum value: INT_8 = 5;
     */
    INT_8 = 5,
    /**
     * Not present in protobuf, needs two 64-bit ints
     *
     * @generated from protobuf enum value: UINT_128 = 6;
     */
    UINT_128 = 6,
    /**
     * @generated from protobuf enum value: UINT_64 = 7;
     */
    UINT_64 = 7,
    /**
     * @generated from protobuf enum value: UINT_32 = 8;
     */
    UINT_32 = 8,
    /**
     * Not present in protobuf
     *
     * @generated from protobuf enum value: UINT_16 = 9;
     */
    UINT_16 = 9,
    /**
     * Not present in protobuf
     *
     * @generated from protobuf enum value: UINT_8 = 10;
     */
    UINT_8 = 10,
    /**
     * @generated from protobuf enum value: FLOAT_64 = 11;
     */
    FLOAT_64 = 11,
    /**
     * @generated from protobuf enum value: FLOAT_32 = 12;
     */
    FLOAT_32 = 12,
    /**
     * Not present in protobuf
     *
     * @generated from protobuf enum value: FLOAT_16 = 13;
     */
    FLOAT_16 = 13,
    /**
     * @generated from protobuf enum value: CHAR = 14;
     */
    CHAR = 14,
    /**
     * @generated from protobuf enum value: BOOL = 15;
     */
    BOOL = 15,
    /**
     * these share the string_val field
     *
     * In protobuf this is really bytes.
     *
     * @generated from protobuf enum value: STRING = 16;
     */
    STRING = 16,
    /**
     * In protobuf this is really bytes.
     *
     * @generated from protobuf enum value: SYMBOL = 17;
     */
    SYMBOL = 17,
    /**
     * VariableSizeStrings are not supported as PrimitiveValues, though the type can
     * show up in (internal) type signatures.
     *
     * @generated from protobuf enum value: VARIABLE_SIZE_STRING = 18;
     */
    VARIABLE_SIZE_STRING = 18
}
/**
 * @generated from protobuf enum relationalai.protocol.Kind
 */
export declare enum Kind {
    /**
     * https://developers.google.com/protocol-buffers/docs/style#enums
     *
     * @generated from protobuf enum value: UNSPECIFIED_KIND = 0;
     */
    UNSPECIFIED_KIND = 0,
    /**
     * @generated from protobuf enum value: PRIMITIVE_TYPE = 1;
     */
    PRIMITIVE_TYPE = 1,
    /**
     * @generated from protobuf enum value: VALUE_TYPE = 2;
     */
    VALUE_TYPE = 2,
    /**
     * @generated from protobuf enum value: CONSTANT_TYPE = 3;
     */
    CONSTANT_TYPE = 3
}
declare class RelationId$Type extends MessageType<RelationId> {
    constructor();
    create(value?: PartialMessage<RelationId>): RelationId;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelationId): RelationId;
    internalBinaryWrite(message: RelationId, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.RelationId
 */
export declare const RelationId: RelationId$Type;
declare class RelTuple$Type extends MessageType<RelTuple> {
    constructor();
    create(value?: PartialMessage<RelTuple>): RelTuple;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelTuple): RelTuple;
    internalBinaryWrite(message: RelTuple, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.RelTuple
 */
export declare const RelTuple: RelTuple$Type;
declare class RelInt128$Type extends MessageType<RelInt128> {
    constructor();
    create(value?: PartialMessage<RelInt128>): RelInt128;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelInt128): RelInt128;
    internalBinaryWrite(message: RelInt128, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.RelInt128
 */
export declare const RelInt128: RelInt128$Type;
declare class RelUInt128$Type extends MessageType<RelUInt128> {
    constructor();
    create(value?: PartialMessage<RelUInt128>): RelUInt128;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelUInt128): RelUInt128;
    internalBinaryWrite(message: RelUInt128, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.RelUInt128
 */
export declare const RelUInt128: RelUInt128$Type;
declare class PrimitiveValue$Type extends MessageType<PrimitiveValue> {
    constructor();
    create(value?: PartialMessage<PrimitiveValue>): PrimitiveValue;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PrimitiveValue): PrimitiveValue;
    internalBinaryWrite(message: PrimitiveValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.PrimitiveValue
 */
export declare const PrimitiveValue: PrimitiveValue$Type;
declare class ValueType$Type extends MessageType<ValueType> {
    constructor();
    create(value?: PartialMessage<ValueType>): ValueType;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ValueType): ValueType;
    internalBinaryWrite(message: ValueType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.ValueType
 */
export declare const ValueType: ValueType$Type;
declare class ConstantType$Type extends MessageType<ConstantType> {
    constructor();
    create(value?: PartialMessage<ConstantType>): ConstantType;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConstantType): ConstantType;
    internalBinaryWrite(message: ConstantType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.ConstantType
 */
export declare const ConstantType: ConstantType$Type;
declare class RelType$Type extends MessageType<RelType> {
    constructor();
    create(value?: PartialMessage<RelType>): RelType;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelType): RelType;
    internalBinaryWrite(message: RelType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.RelType
 */
export declare const RelType: RelType$Type;
export {};
