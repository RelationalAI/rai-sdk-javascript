import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { RelationId } from "./schema";
/**
 * Describes metadata of a set of relations.
 *
 * @generated from protobuf message relationalai.protocol.MetadataInfo
 */
export interface MetadataInfo {
    /**
     * @generated from protobuf field: repeated relationalai.protocol.RelationMetadata relations = 1;
     */
    relations: RelationMetadata[];
}
/**
 * Describes metadata of a single relation.
 *
 * @generated from protobuf message relationalai.protocol.RelationMetadata
 */
export interface RelationMetadata {
    /**
     * Type signature of this relation.
     *
     * @generated from protobuf field: relationalai.protocol.RelationId relation_id = 1;
     */
    relationId?: RelationId;
    /**
     * Identifier for the corresponding data file.
     *
     * @generated from protobuf field: string file_name = 2;
     */
    fileName: string;
}
declare class MetadataInfo$Type extends MessageType<MetadataInfo> {
    constructor();
    create(value?: PartialMessage<MetadataInfo>): MetadataInfo;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MetadataInfo): MetadataInfo;
    internalBinaryWrite(message: MetadataInfo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.MetadataInfo
 */
export declare const MetadataInfo: MetadataInfo$Type;
declare class RelationMetadata$Type extends MessageType<RelationMetadata> {
    constructor();
    create(value?: PartialMessage<RelationMetadata>): RelationMetadata;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelationMetadata): RelationMetadata;
    internalBinaryWrite(message: RelationMetadata, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message relationalai.protocol.RelationMetadata
 */
export declare const RelationMetadata: RelationMetadata$Type;
export {};
