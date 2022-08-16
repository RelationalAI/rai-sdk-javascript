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
import { Table } from 'apache-arrow';
import { RelationId } from '../../proto/generated/schema';
export declare type RelValue = string | number | boolean | null | number[];
export declare type RelKey = {
    type: 'RelKey';
    name: string;
    keys: string[];
    values: string[];
};
export declare type Relation = {
    type: 'Relation';
    rel_key: RelKey;
    columns: RelValue[][];
};
export declare type Model = {
    name: string;
    value: string;
    type: string;
    path?: string;
};
export declare type IntegrityConstraintViolation = {
    type: 'IntegrityConstraintViolation';
    sources: {
        rel_key: RelKey;
        source: string;
        type: string;
    }[];
};
export declare type ClientProblem = {
    type: 'ClientProblem';
    error_code: string;
    is_error: boolean;
    is_exception: boolean;
    message: string;
    path: string;
    report: string;
};
export declare type Problem = IntegrityConstraintViolation | ClientProblem;
export declare type LabeledAction = {
    type: 'LabeledAction';
    name: string;
    action: QueryAction | ModifyWorkspaceAction | InstallAction | ListSourceAction | ListEdbAction;
};
export declare type LabeledActionResult = {
    type: 'LabeledActionResult';
    name: string;
    result: QueryActionResult | ModifyWorkspaceActionResult | InstallActionResult | ListSourceActionResult | ListEdbActionResult;
};
export declare type QueryAction = {
    type: 'QueryAction';
    inputs: Relation[];
    outputs: string[];
    persist: string[];
    source: Model;
};
export declare type QueryActionResult = {
    type: 'QueryActionResult';
    output: Relation[];
};
export declare type ModifyWorkspaceAction = {
    type: 'ModifyWorkspaceAction';
    delete_edb?: string;
    delete_source?: string[];
};
export declare type ModifyWorkspaceActionResult = {
    type: 'ModifyWorkspaceActionResult';
    delete_edb_result?: RelKey[];
};
export declare type InstallAction = {
    type: 'InstallAction';
    sources: Model[];
};
export declare type InstallActionResult = {
    type: 'InstallActionResult';
};
export declare type ListSourceAction = {
    type: 'ListSourceAction';
};
export declare type ListSourceActionResult = {
    type: 'ListSourceActionResult';
    sources: Model[];
};
export declare type ListEdbAction = {
    type: 'ListEdbAction';
};
export declare type ListEdbActionResult = {
    type: 'ListEdbActionResult';
    rels: RelKey[];
};
export declare enum TransactionMode {
    OPEN = "OPEN",
    CREATE = "CREATE",
    CREATE_OVERWRITE = "CREATE_OVERWRITE",
    OPEN_OR_CREATE = "OPEN_OR_CREATE",
    CLONE = "CLONE",
    CLONE_OVERWRITE = "CLONE_OVERWRITE"
}
export declare type Transaction = {
    type: 'Transaction';
    abort: boolean;
    dbname: string;
    mode: TransactionMode;
    nowait_durable: boolean;
    readonly: boolean;
    version: number;
    actions: LabeledAction[];
    computeName?: string;
    source_dbname?: string;
};
export declare type TransactionResult = {
    type: 'TransactionResult';
    aborted: boolean;
    debug_level: number;
    version: number;
    output: Relation[];
    problems: Problem[];
    actions: LabeledActionResult[];
};
export declare enum TransactionAsyncState {
    CREATED = "CREATED",
    RUNNING = "RUNNING",
    CANCELLING = "CANCELLING",
    ABORTED = "ABORTED",
    COMPLETED = "COMPLETED"
}
export declare type TransactionAsyncPayload = {
    dbname: string;
    nowait_durable: boolean;
    readonly: boolean;
    engine_name?: string;
    query: string;
    v1_inputs: Relation[];
    tags?: string[];
};
export declare type TransactionAsync = {
    id: string;
    account_name: string;
    engine_name: string;
    database_name: string;
    state: TransactionAsyncState;
    created_by?: string;
    created_on?: number;
    finished_at?: number;
    duration?: number;
    read_only: boolean;
    last_requested_interval: string;
    response_format_version: string;
    query: string;
    user_agent: string;
    abort_reason?: string;
    tags?: string[];
};
export declare type TransactionAsyncCompact = {
    id: string;
    state: TransactionAsyncState;
};
export declare type TransactionAsyncFile = {
    name: string;
    file: File | string;
};
export declare type ArrowResult = {
    relationId: string;
    filename: string;
    table: Table;
};
export declare type ArrowRelation = {
    relationId: string;
    table: Table;
    metadata: RelationId;
};
export declare type TransactionAsyncResult = {
    transaction: TransactionAsyncCompact | TransactionAsync;
    problems?: Problem[];
    results: ArrowRelation[];
};
export declare type TransactionListOptions = {
    database_name?: string | string[];
    engine_name?: string | string[];
    state?: TransactionAsyncState | TransactionAsyncState[];
    tags?: string | string[];
};
