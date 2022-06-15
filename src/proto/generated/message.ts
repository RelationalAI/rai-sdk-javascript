/* eslint-disable */
import Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import { RelationId } from './schema';

export const protobufPackage = 'relationalai.protocol';

/** Describes metadata of a set of relations. */
export interface MetadataInfo {
  relations: RelationMetadata[];
}

/** Describes metadata of a single relation. */
export interface RelationMetadata {
  /** Type signature of this relation. */
  relationId: RelationId | undefined;
  /** Identifier for the corresponding data file. */
  fileName: string;
}

function createBaseMetadataInfo(): MetadataInfo {
  return { relations: [] };
}

export const MetadataInfo = {
  encode(
    message: MetadataInfo,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.relations) {
      RelationMetadata.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MetadataInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadataInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.relations.push(
            RelationMetadata.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MetadataInfo {
    return {
      relations: Array.isArray(object?.relations)
        ? object.relations.map((e: any) => RelationMetadata.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MetadataInfo): unknown {
    const obj: any = {};
    if (message.relations) {
      obj.relations = message.relations.map(e =>
        e ? RelationMetadata.toJSON(e) : undefined,
      );
    } else {
      obj.relations = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MetadataInfo>, I>>(
    object: I,
  ): MetadataInfo {
    const message = createBaseMetadataInfo();
    message.relations =
      object.relations?.map(e => RelationMetadata.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRelationMetadata(): RelationMetadata {
  return { relationId: undefined, fileName: '' };
}

export const RelationMetadata = {
  encode(
    message: RelationMetadata,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.relationId !== undefined) {
      RelationId.encode(message.relationId, writer.uint32(10).fork()).ldelim();
    }
    if (message.fileName !== '') {
      writer.uint32(18).string(message.fileName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelationMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.relationId = RelationId.decode(reader, reader.uint32());
          break;
        case 2:
          message.fileName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelationMetadata {
    return {
      relationId: isSet(object.relationId)
        ? RelationId.fromJSON(object.relationId)
        : undefined,
      fileName: isSet(object.fileName) ? String(object.fileName) : '',
    };
  },

  toJSON(message: RelationMetadata): unknown {
    const obj: any = {};
    message.relationId !== undefined &&
      (obj.relationId = message.relationId
        ? RelationId.toJSON(message.relationId)
        : undefined);
    message.fileName !== undefined && (obj.fileName = message.fileName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelationMetadata>, I>>(
    object: I,
  ): RelationMetadata {
    const message = createBaseRelationMetadata();
    message.relationId =
      object.relationId !== undefined && object.relationId !== null
        ? RelationId.fromPartial(object.relationId)
        : undefined;
    message.fileName = object.fileName ?? '';
    return message;
  },
};

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
