/* eslint-disable */
import Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import { RelUInt128, RelationId, RelTuple } from './schema';

export const protobufPackage = 'relationalai.protocol';

/** wrapper for all metadata pages */
export interface MetadataPage {
  /** optional; not present for pure diff pages */
  dbRoot: RAIDatabase | undefined;
  diff: Diff | undefined;
}

/** named RAIDatabase to not conflict with the RAI.Database namespace. */
export interface RAIDatabase {
  /**
   * Currently on version 1.
   * This is only needed at the top level (i.e., on a database page instead of diff pages)
   * because on any major version change we should rewrite the whole thing instead of leaving
   * dangling old-format pages. This lets us eventually clean up the old codepaths instead of
   * leaving migration logic around forever.
   */
  metadataFormatVersion: number;
  root: MetadataNode | undefined;
  /**
   * ws_context in Julia. if we ever need to keep more workspace-related things, we should
   * consider moving all of it to a containing proto message.
   */
  entityCounter: number;
}

/**
 * MetadataNodes represent the tree structure of incremental diffs, and correspond to the
 * Database.MetadataNode struct.
 */
export interface MetadataNode {
  capacity: number;
  leafcount: number;
  /**
   * If Page is present, then children must be empty
   * and vice versa.
   */
  consolidated: PageId | undefined;
  children: MetadataNode[];
}

/** In RAI, a PageId is 128-bit but this may change in the future */
export interface PageId {
  pid: RelUInt128 | undefined;
}

export interface RelationData {
  /** Only one of betree or inline should exist */
  betree: BeTreeRelation | undefined;
  inline: InlineRelation | undefined;
}

export interface BeTreeRelation {
  root: PageId | undefined;
  elementCount: number;
  treeHeight: number;
}

/**
 * This corresponds to SerializedTipOrDiff, but leaving out the 'Tip'
 * related fields, which are now separate.
 */
export interface Diff {
  /**
   * Version string for RAI, used to detect when we are restoring
   * from a possibly outdated RAI version with different
   * object layouts for derived data.
   */
  raiServerVersion: string;
  /** version_interval in SerializedTipOrDiff */
  databaseVersionMin: number;
  databaseVersionMax: number;
  /** Arroyo SnapshotDiff for input key/values. */
  inputs: InputDiff | undefined;
  sourceInputs: SourceInputDiff | undefined;
  /** Arroyo SnapshotDiff for derived key/values. Julia-serialized, discarded on rai-server version change. */
  derived: DerivedDiff | undefined;
}

/**
 * Source inputs are not intended to be kept around forever, so we store them separately from relation inputs.
 * This should make it easier to rip them out later as part of #7773.
 */
export interface SourceInputDiff {
  sourceUpdates: Source[];
  /** names of deleted sources */
  sourceDeletes: string[];
}

export interface Source {
  name: string;
  value: string;
}

/** We do not plan to store any inputs that are not relations */
export interface InputDiff {
  /** Note: need to separately enforce uniqueness (updates and deletes must be disjoint) */
  edbUpdates: Relation[];
  edbDeletes: RelationId[];
}

/**
 * DerivedDiff is treated as binary for now.
 * Possibly we could separate IDB relations?
 */
export interface DerivedDiff {
  serialization: Uint8Array;
}

/** Relation, types */
export interface Relation {
  id: RelationId | undefined;
  /** Currently only contains the RelKey FD */
  functionalDependencies: FunctionalDependency[];
  relationData: RelationData | undefined;
  storageConfig: StorageConfig | undefined;
}

export interface StorageConfig {
  /** for inline relations, the storage config is empty */
  isEmpty: boolean;
  /** otherwise, the betree config describes how the paged data is stored */
  beTreeConfig: BeTreeConfig | undefined;
}

export interface BeTreeConfig {
  epsilon: number;
  maxPivots: number;
  maxDeltas: number;
  maxLeaf: number;
}

export interface FunctionalDependency {
  keyIndexes: number[];
  valueIndexes: number[];
}

export interface InlineRelation {
  /**
   * We only expect to inline relatively small relations, so we store data tuple-wise.
   * The types are specified in the relation id.
   */
  tuples: RelTuple[];
  /**
   * The hash field of an inline relation is used to check equality of inline relations.
   * by preserving it here, we preserve the effective identifier over the lifetime of
   * this relation, which is necessary for the verify_metadata_roundtrip checks to pass.
   */
  hash: number;
}

function createBaseMetadataPage(): MetadataPage {
  return { dbRoot: undefined, diff: undefined };
}

export const MetadataPage = {
  encode(
    message: MetadataPage,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.dbRoot !== undefined) {
      RAIDatabase.encode(message.dbRoot, writer.uint32(10).fork()).ldelim();
    }
    if (message.diff !== undefined) {
      Diff.encode(message.diff, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MetadataPage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadataPage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dbRoot = RAIDatabase.decode(reader, reader.uint32());
          break;
        case 2:
          message.diff = Diff.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MetadataPage {
    return {
      dbRoot: isSet(object.dbRoot)
        ? RAIDatabase.fromJSON(object.dbRoot)
        : undefined,
      diff: isSet(object.diff) ? Diff.fromJSON(object.diff) : undefined,
    };
  },

  toJSON(message: MetadataPage): unknown {
    const obj: any = {};
    message.dbRoot !== undefined &&
      (obj.dbRoot = message.dbRoot
        ? RAIDatabase.toJSON(message.dbRoot)
        : undefined);
    message.diff !== undefined &&
      (obj.diff = message.diff ? Diff.toJSON(message.diff) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MetadataPage>, I>>(
    object: I,
  ): MetadataPage {
    const message = createBaseMetadataPage();
    message.dbRoot =
      object.dbRoot !== undefined && object.dbRoot !== null
        ? RAIDatabase.fromPartial(object.dbRoot)
        : undefined;
    message.diff =
      object.diff !== undefined && object.diff !== null
        ? Diff.fromPartial(object.diff)
        : undefined;
    return message;
  },
};

function createBaseRAIDatabase(): RAIDatabase {
  return { metadataFormatVersion: 0, root: undefined, entityCounter: 0 };
}

export const RAIDatabase = {
  encode(
    message: RAIDatabase,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.metadataFormatVersion !== 0) {
      writer.uint32(8).int64(message.metadataFormatVersion);
    }
    if (message.root !== undefined) {
      MetadataNode.encode(message.root, writer.uint32(18).fork()).ldelim();
    }
    if (message.entityCounter !== 0) {
      writer.uint32(24).int64(message.entityCounter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RAIDatabase {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRAIDatabase();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.metadataFormatVersion = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.root = MetadataNode.decode(reader, reader.uint32());
          break;
        case 3:
          message.entityCounter = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RAIDatabase {
    return {
      metadataFormatVersion: isSet(object.metadataFormatVersion)
        ? Number(object.metadataFormatVersion)
        : 0,
      root: isSet(object.root) ? MetadataNode.fromJSON(object.root) : undefined,
      entityCounter: isSet(object.entityCounter)
        ? Number(object.entityCounter)
        : 0,
    };
  },

  toJSON(message: RAIDatabase): unknown {
    const obj: any = {};
    message.metadataFormatVersion !== undefined &&
      (obj.metadataFormatVersion = Math.round(message.metadataFormatVersion));
    message.root !== undefined &&
      (obj.root = message.root ? MetadataNode.toJSON(message.root) : undefined);
    message.entityCounter !== undefined &&
      (obj.entityCounter = Math.round(message.entityCounter));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RAIDatabase>, I>>(
    object: I,
  ): RAIDatabase {
    const message = createBaseRAIDatabase();
    message.metadataFormatVersion = object.metadataFormatVersion ?? 0;
    message.root =
      object.root !== undefined && object.root !== null
        ? MetadataNode.fromPartial(object.root)
        : undefined;
    message.entityCounter = object.entityCounter ?? 0;
    return message;
  },
};

function createBaseMetadataNode(): MetadataNode {
  return { capacity: 0, leafcount: 0, consolidated: undefined, children: [] };
}

export const MetadataNode = {
  encode(
    message: MetadataNode,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.capacity !== 0) {
      writer.uint32(8).int64(message.capacity);
    }
    if (message.leafcount !== 0) {
      writer.uint32(16).int64(message.leafcount);
    }
    if (message.consolidated !== undefined) {
      PageId.encode(message.consolidated, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.children) {
      MetadataNode.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MetadataNode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadataNode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.capacity = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.leafcount = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.consolidated = PageId.decode(reader, reader.uint32());
          break;
        case 4:
          message.children.push(MetadataNode.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MetadataNode {
    return {
      capacity: isSet(object.capacity) ? Number(object.capacity) : 0,
      leafcount: isSet(object.leafcount) ? Number(object.leafcount) : 0,
      consolidated: isSet(object.consolidated)
        ? PageId.fromJSON(object.consolidated)
        : undefined,
      children: Array.isArray(object?.children)
        ? object.children.map((e: any) => MetadataNode.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MetadataNode): unknown {
    const obj: any = {};
    message.capacity !== undefined &&
      (obj.capacity = Math.round(message.capacity));
    message.leafcount !== undefined &&
      (obj.leafcount = Math.round(message.leafcount));
    message.consolidated !== undefined &&
      (obj.consolidated = message.consolidated
        ? PageId.toJSON(message.consolidated)
        : undefined);
    if (message.children) {
      obj.children = message.children.map(e =>
        e ? MetadataNode.toJSON(e) : undefined,
      );
    } else {
      obj.children = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MetadataNode>, I>>(
    object: I,
  ): MetadataNode {
    const message = createBaseMetadataNode();
    message.capacity = object.capacity ?? 0;
    message.leafcount = object.leafcount ?? 0;
    message.consolidated =
      object.consolidated !== undefined && object.consolidated !== null
        ? PageId.fromPartial(object.consolidated)
        : undefined;
    message.children =
      object.children?.map(e => MetadataNode.fromPartial(e)) || [];
    return message;
  },
};

function createBasePageId(): PageId {
  return { pid: undefined };
}

export const PageId = {
  encode(
    message: PageId,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.pid !== undefined) {
      RelUInt128.encode(message.pid, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PageId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePageId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pid = RelUInt128.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PageId {
    return {
      pid: isSet(object.pid) ? RelUInt128.fromJSON(object.pid) : undefined,
    };
  },

  toJSON(message: PageId): unknown {
    const obj: any = {};
    message.pid !== undefined &&
      (obj.pid = message.pid ? RelUInt128.toJSON(message.pid) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PageId>, I>>(object: I): PageId {
    const message = createBasePageId();
    message.pid =
      object.pid !== undefined && object.pid !== null
        ? RelUInt128.fromPartial(object.pid)
        : undefined;
    return message;
  },
};

function createBaseRelationData(): RelationData {
  return { betree: undefined, inline: undefined };
}

export const RelationData = {
  encode(
    message: RelationData,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.betree !== undefined) {
      BeTreeRelation.encode(message.betree, writer.uint32(26).fork()).ldelim();
    }
    if (message.inline !== undefined) {
      InlineRelation.encode(message.inline, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelationData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.betree = BeTreeRelation.decode(reader, reader.uint32());
          break;
        case 4:
          message.inline = InlineRelation.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RelationData {
    return {
      betree: isSet(object.betree)
        ? BeTreeRelation.fromJSON(object.betree)
        : undefined,
      inline: isSet(object.inline)
        ? InlineRelation.fromJSON(object.inline)
        : undefined,
    };
  },

  toJSON(message: RelationData): unknown {
    const obj: any = {};
    message.betree !== undefined &&
      (obj.betree = message.betree
        ? BeTreeRelation.toJSON(message.betree)
        : undefined);
    message.inline !== undefined &&
      (obj.inline = message.inline
        ? InlineRelation.toJSON(message.inline)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RelationData>, I>>(
    object: I,
  ): RelationData {
    const message = createBaseRelationData();
    message.betree =
      object.betree !== undefined && object.betree !== null
        ? BeTreeRelation.fromPartial(object.betree)
        : undefined;
    message.inline =
      object.inline !== undefined && object.inline !== null
        ? InlineRelation.fromPartial(object.inline)
        : undefined;
    return message;
  },
};

function createBaseBeTreeRelation(): BeTreeRelation {
  return { root: undefined, elementCount: 0, treeHeight: 0 };
}

export const BeTreeRelation = {
  encode(
    message: BeTreeRelation,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.root !== undefined) {
      PageId.encode(message.root, writer.uint32(10).fork()).ldelim();
    }
    if (message.elementCount !== 0) {
      writer.uint32(16).int64(message.elementCount);
    }
    if (message.treeHeight !== 0) {
      writer.uint32(24).int64(message.treeHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BeTreeRelation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBeTreeRelation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.root = PageId.decode(reader, reader.uint32());
          break;
        case 2:
          message.elementCount = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.treeHeight = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BeTreeRelation {
    return {
      root: isSet(object.root) ? PageId.fromJSON(object.root) : undefined,
      elementCount: isSet(object.elementCount)
        ? Number(object.elementCount)
        : 0,
      treeHeight: isSet(object.treeHeight) ? Number(object.treeHeight) : 0,
    };
  },

  toJSON(message: BeTreeRelation): unknown {
    const obj: any = {};
    message.root !== undefined &&
      (obj.root = message.root ? PageId.toJSON(message.root) : undefined);
    message.elementCount !== undefined &&
      (obj.elementCount = Math.round(message.elementCount));
    message.treeHeight !== undefined &&
      (obj.treeHeight = Math.round(message.treeHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BeTreeRelation>, I>>(
    object: I,
  ): BeTreeRelation {
    const message = createBaseBeTreeRelation();
    message.root =
      object.root !== undefined && object.root !== null
        ? PageId.fromPartial(object.root)
        : undefined;
    message.elementCount = object.elementCount ?? 0;
    message.treeHeight = object.treeHeight ?? 0;
    return message;
  },
};

function createBaseDiff(): Diff {
  return {
    raiServerVersion: '',
    databaseVersionMin: 0,
    databaseVersionMax: 0,
    inputs: undefined,
    sourceInputs: undefined,
    derived: undefined,
  };
}

export const Diff = {
  encode(message: Diff, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.raiServerVersion !== '') {
      writer.uint32(10).string(message.raiServerVersion);
    }
    if (message.databaseVersionMin !== 0) {
      writer.uint32(16).int64(message.databaseVersionMin);
    }
    if (message.databaseVersionMax !== 0) {
      writer.uint32(24).int64(message.databaseVersionMax);
    }
    if (message.inputs !== undefined) {
      InputDiff.encode(message.inputs, writer.uint32(34).fork()).ldelim();
    }
    if (message.sourceInputs !== undefined) {
      SourceInputDiff.encode(
        message.sourceInputs,
        writer.uint32(42).fork(),
      ).ldelim();
    }
    if (message.derived !== undefined) {
      DerivedDiff.encode(message.derived, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Diff {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDiff();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.raiServerVersion = reader.string();
          break;
        case 2:
          message.databaseVersionMin = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.databaseVersionMax = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.inputs = InputDiff.decode(reader, reader.uint32());
          break;
        case 5:
          message.sourceInputs = SourceInputDiff.decode(
            reader,
            reader.uint32(),
          );
          break;
        case 6:
          message.derived = DerivedDiff.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Diff {
    return {
      raiServerVersion: isSet(object.raiServerVersion)
        ? String(object.raiServerVersion)
        : '',
      databaseVersionMin: isSet(object.databaseVersionMin)
        ? Number(object.databaseVersionMin)
        : 0,
      databaseVersionMax: isSet(object.databaseVersionMax)
        ? Number(object.databaseVersionMax)
        : 0,
      inputs: isSet(object.inputs)
        ? InputDiff.fromJSON(object.inputs)
        : undefined,
      sourceInputs: isSet(object.sourceInputs)
        ? SourceInputDiff.fromJSON(object.sourceInputs)
        : undefined,
      derived: isSet(object.derived)
        ? DerivedDiff.fromJSON(object.derived)
        : undefined,
    };
  },

  toJSON(message: Diff): unknown {
    const obj: any = {};
    message.raiServerVersion !== undefined &&
      (obj.raiServerVersion = message.raiServerVersion);
    message.databaseVersionMin !== undefined &&
      (obj.databaseVersionMin = Math.round(message.databaseVersionMin));
    message.databaseVersionMax !== undefined &&
      (obj.databaseVersionMax = Math.round(message.databaseVersionMax));
    message.inputs !== undefined &&
      (obj.inputs = message.inputs
        ? InputDiff.toJSON(message.inputs)
        : undefined);
    message.sourceInputs !== undefined &&
      (obj.sourceInputs = message.sourceInputs
        ? SourceInputDiff.toJSON(message.sourceInputs)
        : undefined);
    message.derived !== undefined &&
      (obj.derived = message.derived
        ? DerivedDiff.toJSON(message.derived)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Diff>, I>>(object: I): Diff {
    const message = createBaseDiff();
    message.raiServerVersion = object.raiServerVersion ?? '';
    message.databaseVersionMin = object.databaseVersionMin ?? 0;
    message.databaseVersionMax = object.databaseVersionMax ?? 0;
    message.inputs =
      object.inputs !== undefined && object.inputs !== null
        ? InputDiff.fromPartial(object.inputs)
        : undefined;
    message.sourceInputs =
      object.sourceInputs !== undefined && object.sourceInputs !== null
        ? SourceInputDiff.fromPartial(object.sourceInputs)
        : undefined;
    message.derived =
      object.derived !== undefined && object.derived !== null
        ? DerivedDiff.fromPartial(object.derived)
        : undefined;
    return message;
  },
};

function createBaseSourceInputDiff(): SourceInputDiff {
  return { sourceUpdates: [], sourceDeletes: [] };
}

export const SourceInputDiff = {
  encode(
    message: SourceInputDiff,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.sourceUpdates) {
      Source.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.sourceDeletes) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SourceInputDiff {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSourceInputDiff();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sourceUpdates.push(Source.decode(reader, reader.uint32()));
          break;
        case 2:
          message.sourceDeletes.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SourceInputDiff {
    return {
      sourceUpdates: Array.isArray(object?.sourceUpdates)
        ? object.sourceUpdates.map((e: any) => Source.fromJSON(e))
        : [],
      sourceDeletes: Array.isArray(object?.sourceDeletes)
        ? object.sourceDeletes.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SourceInputDiff): unknown {
    const obj: any = {};
    if (message.sourceUpdates) {
      obj.sourceUpdates = message.sourceUpdates.map(e =>
        e ? Source.toJSON(e) : undefined,
      );
    } else {
      obj.sourceUpdates = [];
    }
    if (message.sourceDeletes) {
      obj.sourceDeletes = message.sourceDeletes.map(e => e);
    } else {
      obj.sourceDeletes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SourceInputDiff>, I>>(
    object: I,
  ): SourceInputDiff {
    const message = createBaseSourceInputDiff();
    message.sourceUpdates =
      object.sourceUpdates?.map(e => Source.fromPartial(e)) || [];
    message.sourceDeletes = object.sourceDeletes?.map(e => e) || [];
    return message;
  },
};

function createBaseSource(): Source {
  return { name: '', value: '' };
}

export const Source = {
  encode(
    message: Source,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Source {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSource();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Source {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      value: isSet(object.value) ? String(object.value) : '',
    };
  },

  toJSON(message: Source): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Source>, I>>(object: I): Source {
    const message = createBaseSource();
    message.name = object.name ?? '';
    message.value = object.value ?? '';
    return message;
  },
};

function createBaseInputDiff(): InputDiff {
  return { edbUpdates: [], edbDeletes: [] };
}

export const InputDiff = {
  encode(
    message: InputDiff,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.edbUpdates) {
      Relation.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.edbDeletes) {
      RelationId.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InputDiff {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInputDiff();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.edbUpdates.push(Relation.decode(reader, reader.uint32()));
          break;
        case 2:
          message.edbDeletes.push(RelationId.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InputDiff {
    return {
      edbUpdates: Array.isArray(object?.edbUpdates)
        ? object.edbUpdates.map((e: any) => Relation.fromJSON(e))
        : [],
      edbDeletes: Array.isArray(object?.edbDeletes)
        ? object.edbDeletes.map((e: any) => RelationId.fromJSON(e))
        : [],
    };
  },

  toJSON(message: InputDiff): unknown {
    const obj: any = {};
    if (message.edbUpdates) {
      obj.edbUpdates = message.edbUpdates.map(e =>
        e ? Relation.toJSON(e) : undefined,
      );
    } else {
      obj.edbUpdates = [];
    }
    if (message.edbDeletes) {
      obj.edbDeletes = message.edbDeletes.map(e =>
        e ? RelationId.toJSON(e) : undefined,
      );
    } else {
      obj.edbDeletes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InputDiff>, I>>(
    object: I,
  ): InputDiff {
    const message = createBaseInputDiff();
    message.edbUpdates =
      object.edbUpdates?.map(e => Relation.fromPartial(e)) || [];
    message.edbDeletes =
      object.edbDeletes?.map(e => RelationId.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDerivedDiff(): DerivedDiff {
  return { serialization: new Uint8Array() };
}

export const DerivedDiff = {
  encode(
    message: DerivedDiff,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.serialization.length !== 0) {
      writer.uint32(10).bytes(message.serialization);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DerivedDiff {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDerivedDiff();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serialization = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DerivedDiff {
    return {
      serialization: isSet(object.serialization)
        ? bytesFromBase64(object.serialization)
        : new Uint8Array(),
    };
  },

  toJSON(message: DerivedDiff): unknown {
    const obj: any = {};
    message.serialization !== undefined &&
      (obj.serialization = base64FromBytes(
        message.serialization !== undefined
          ? message.serialization
          : new Uint8Array(),
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DerivedDiff>, I>>(
    object: I,
  ): DerivedDiff {
    const message = createBaseDerivedDiff();
    message.serialization = object.serialization ?? new Uint8Array();
    return message;
  },
};

function createBaseRelation(): Relation {
  return {
    id: undefined,
    functionalDependencies: [],
    relationData: undefined,
    storageConfig: undefined,
  };
}

export const Relation = {
  encode(
    message: Relation,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.id !== undefined) {
      RelationId.encode(message.id, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.functionalDependencies) {
      FunctionalDependency.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.relationData !== undefined) {
      RelationData.encode(
        message.relationData,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    if (message.storageConfig !== undefined) {
      StorageConfig.encode(
        message.storageConfig,
        writer.uint32(34).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Relation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = RelationId.decode(reader, reader.uint32());
          break;
        case 2:
          message.functionalDependencies.push(
            FunctionalDependency.decode(reader, reader.uint32()),
          );
          break;
        case 3:
          message.relationData = RelationData.decode(reader, reader.uint32());
          break;
        case 4:
          message.storageConfig = StorageConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Relation {
    return {
      id: isSet(object.id) ? RelationId.fromJSON(object.id) : undefined,
      functionalDependencies: Array.isArray(object?.functionalDependencies)
        ? object.functionalDependencies.map((e: any) =>
            FunctionalDependency.fromJSON(e),
          )
        : [],
      relationData: isSet(object.relationData)
        ? RelationData.fromJSON(object.relationData)
        : undefined,
      storageConfig: isSet(object.storageConfig)
        ? StorageConfig.fromJSON(object.storageConfig)
        : undefined,
    };
  },

  toJSON(message: Relation): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? RelationId.toJSON(message.id) : undefined);
    if (message.functionalDependencies) {
      obj.functionalDependencies = message.functionalDependencies.map(e =>
        e ? FunctionalDependency.toJSON(e) : undefined,
      );
    } else {
      obj.functionalDependencies = [];
    }
    message.relationData !== undefined &&
      (obj.relationData = message.relationData
        ? RelationData.toJSON(message.relationData)
        : undefined);
    message.storageConfig !== undefined &&
      (obj.storageConfig = message.storageConfig
        ? StorageConfig.toJSON(message.storageConfig)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Relation>, I>>(object: I): Relation {
    const message = createBaseRelation();
    message.id =
      object.id !== undefined && object.id !== null
        ? RelationId.fromPartial(object.id)
        : undefined;
    message.functionalDependencies =
      object.functionalDependencies?.map(e =>
        FunctionalDependency.fromPartial(e),
      ) || [];
    message.relationData =
      object.relationData !== undefined && object.relationData !== null
        ? RelationData.fromPartial(object.relationData)
        : undefined;
    message.storageConfig =
      object.storageConfig !== undefined && object.storageConfig !== null
        ? StorageConfig.fromPartial(object.storageConfig)
        : undefined;
    return message;
  },
};

function createBaseStorageConfig(): StorageConfig {
  return { isEmpty: false, beTreeConfig: undefined };
}

export const StorageConfig = {
  encode(
    message: StorageConfig,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.isEmpty === true) {
      writer.uint32(8).bool(message.isEmpty);
    }
    if (message.beTreeConfig !== undefined) {
      BeTreeConfig.encode(
        message.beTreeConfig,
        writer.uint32(18).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StorageConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStorageConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isEmpty = reader.bool();
          break;
        case 2:
          message.beTreeConfig = BeTreeConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StorageConfig {
    return {
      isEmpty: isSet(object.isEmpty) ? Boolean(object.isEmpty) : false,
      beTreeConfig: isSet(object.beTreeConfig)
        ? BeTreeConfig.fromJSON(object.beTreeConfig)
        : undefined,
    };
  },

  toJSON(message: StorageConfig): unknown {
    const obj: any = {};
    message.isEmpty !== undefined && (obj.isEmpty = message.isEmpty);
    message.beTreeConfig !== undefined &&
      (obj.beTreeConfig = message.beTreeConfig
        ? BeTreeConfig.toJSON(message.beTreeConfig)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StorageConfig>, I>>(
    object: I,
  ): StorageConfig {
    const message = createBaseStorageConfig();
    message.isEmpty = object.isEmpty ?? false;
    message.beTreeConfig =
      object.beTreeConfig !== undefined && object.beTreeConfig !== null
        ? BeTreeConfig.fromPartial(object.beTreeConfig)
        : undefined;
    return message;
  },
};

function createBaseBeTreeConfig(): BeTreeConfig {
  return { epsilon: 0, maxPivots: 0, maxDeltas: 0, maxLeaf: 0 };
}

export const BeTreeConfig = {
  encode(
    message: BeTreeConfig,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.epsilon !== 0) {
      writer.uint32(9).double(message.epsilon);
    }
    if (message.maxPivots !== 0) {
      writer.uint32(16).int64(message.maxPivots);
    }
    if (message.maxDeltas !== 0) {
      writer.uint32(24).int64(message.maxDeltas);
    }
    if (message.maxLeaf !== 0) {
      writer.uint32(32).int64(message.maxLeaf);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BeTreeConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBeTreeConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.epsilon = reader.double();
          break;
        case 2:
          message.maxPivots = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.maxDeltas = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.maxLeaf = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BeTreeConfig {
    return {
      epsilon: isSet(object.epsilon) ? Number(object.epsilon) : 0,
      maxPivots: isSet(object.maxPivots) ? Number(object.maxPivots) : 0,
      maxDeltas: isSet(object.maxDeltas) ? Number(object.maxDeltas) : 0,
      maxLeaf: isSet(object.maxLeaf) ? Number(object.maxLeaf) : 0,
    };
  },

  toJSON(message: BeTreeConfig): unknown {
    const obj: any = {};
    message.epsilon !== undefined && (obj.epsilon = message.epsilon);
    message.maxPivots !== undefined &&
      (obj.maxPivots = Math.round(message.maxPivots));
    message.maxDeltas !== undefined &&
      (obj.maxDeltas = Math.round(message.maxDeltas));
    message.maxLeaf !== undefined &&
      (obj.maxLeaf = Math.round(message.maxLeaf));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BeTreeConfig>, I>>(
    object: I,
  ): BeTreeConfig {
    const message = createBaseBeTreeConfig();
    message.epsilon = object.epsilon ?? 0;
    message.maxPivots = object.maxPivots ?? 0;
    message.maxDeltas = object.maxDeltas ?? 0;
    message.maxLeaf = object.maxLeaf ?? 0;
    return message;
  },
};

function createBaseFunctionalDependency(): FunctionalDependency {
  return { keyIndexes: [], valueIndexes: [] };
}

export const FunctionalDependency = {
  encode(
    message: FunctionalDependency,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.keyIndexes) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(18).fork();
    for (const v of message.valueIndexes) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): FunctionalDependency {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFunctionalDependency();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.keyIndexes.push(reader.int32());
            }
          } else {
            message.keyIndexes.push(reader.int32());
          }
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.valueIndexes.push(reader.int32());
            }
          } else {
            message.valueIndexes.push(reader.int32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FunctionalDependency {
    return {
      keyIndexes: Array.isArray(object?.keyIndexes)
        ? object.keyIndexes.map((e: any) => Number(e))
        : [],
      valueIndexes: Array.isArray(object?.valueIndexes)
        ? object.valueIndexes.map((e: any) => Number(e))
        : [],
    };
  },

  toJSON(message: FunctionalDependency): unknown {
    const obj: any = {};
    if (message.keyIndexes) {
      obj.keyIndexes = message.keyIndexes.map(e => Math.round(e));
    } else {
      obj.keyIndexes = [];
    }
    if (message.valueIndexes) {
      obj.valueIndexes = message.valueIndexes.map(e => Math.round(e));
    } else {
      obj.valueIndexes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FunctionalDependency>, I>>(
    object: I,
  ): FunctionalDependency {
    const message = createBaseFunctionalDependency();
    message.keyIndexes = object.keyIndexes?.map(e => e) || [];
    message.valueIndexes = object.valueIndexes?.map(e => e) || [];
    return message;
  },
};

function createBaseInlineRelation(): InlineRelation {
  return { tuples: [], hash: 0 };
}

export const InlineRelation = {
  encode(
    message: InlineRelation,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.tuples) {
      RelTuple.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.hash !== 0) {
      writer.uint32(16).uint64(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InlineRelation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInlineRelation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tuples.push(RelTuple.decode(reader, reader.uint32()));
          break;
        case 2:
          message.hash = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InlineRelation {
    return {
      tuples: Array.isArray(object?.tuples)
        ? object.tuples.map((e: any) => RelTuple.fromJSON(e))
        : [],
      hash: isSet(object.hash) ? Number(object.hash) : 0,
    };
  },

  toJSON(message: InlineRelation): unknown {
    const obj: any = {};
    if (message.tuples) {
      obj.tuples = message.tuples.map(e =>
        e ? RelTuple.toJSON(e) : undefined,
      );
    } else {
      obj.tuples = [];
    }
    message.hash !== undefined && (obj.hash = Math.round(message.hash));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InlineRelation>, I>>(
    object: I,
  ): InlineRelation {
    const message = createBaseInlineRelation();
    message.tuples = object.tuples?.map(e => RelTuple.fromPartial(e)) || [];
    message.hash = object.hash ?? 0;
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
