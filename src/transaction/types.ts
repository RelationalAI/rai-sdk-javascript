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

export type RelValue = string | number | boolean | null | number[];

export type RelKey = {
  type: 'RelKey';
  name: string;
  keys: string[];
  values: string[];
};

export type Relation = {
  type: 'Relation';
  rel_key: RelKey;
  columns: RelValue[][];
};

export type Model = {
  name: string;
  value: string;
  type: string;
  path?: string;
};

export type IntegrityConstraintViolation = {
  type: 'IntegrityConstraintViolation';
  sources: {
    rel_key: RelKey;
    source: string;
    type: string;
  }[];
};

export type ClientProblem = {
  type: 'ClientProblem';
  error_code: string;
  is_error: boolean;
  is_exception: boolean;
  message: string;
  path: string;
  report: string;
};

export type Problem = IntegrityConstraintViolation | ClientProblem;

export type LabeledAction = {
  type: 'LabeledAction';
  name: string;
  action:
    | QueryAction
    | ModifyWorkspaceAction
    | InstallAction
    | ListSourceAction
    | ListEdbAction;
};

export type LabeledActionResult = {
  type: 'LabeledActionResult';
  name: string;
  result:
    | QueryActionResult
    | ModifyWorkspaceActionResult
    | InstallActionResult
    | ListSourceActionResult
    | ListEdbActionResult;
};

export type QueryAction = {
  type: 'QueryAction';
  inputs: Relation[];
  outputs: string[];
  persist: string[];
  source: Model;
};

export type QueryActionResult = {
  type: 'QueryActionResult';
  output: Relation[];
};

export type ModifyWorkspaceAction = {
  type: 'ModifyWorkspaceAction';
  delete_edb?: string;
  delete_source?: string[];
};

export type ModifyWorkspaceActionResult = {
  type: 'ModifyWorkspaceActionResult';
  delete_edb_result?: RelKey[];
};

export type InstallAction = {
  type: 'InstallAction';
  sources: Model[];
};

export type InstallActionResult = {
  type: 'InstallActionResult';
};

export type ListSourceAction = {
  type: 'ListSourceAction';
};

export type ListSourceActionResult = {
  type: 'ListSourceActionResult';
  sources: Model[];
};

export type ListEdbAction = {
  type: 'ListEdbAction';
};

export type ListEdbActionResult = {
  type: 'ListEdbActionResult';
  rels: RelKey[];
};

export enum TransactionMode {
  OPEN = 'OPEN',
  CREATE = 'CREATE',
  CREATE_OVERWRITE = 'CREATE_OVERWRITE',
  OPEN_OR_CREATE = 'OPEN_OR_CREATE',
  CLONE = 'CLONE',
  CLONE_OVERWRITE = 'CLONE_OVERWRITE',
}

export type Transaction = {
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

export type TransactionResult = {
  type: 'TransactionResult';
  aborted: boolean;
  debug_level: number;
  version: number;
  output: Relation[];
  problems: Problem[];
  actions: LabeledActionResult[];
};

export enum TransactionAsyncState {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  CANCELLING = 'CANCELLING',
  ABORTED = 'ABORTED',
  COMPLETED = 'COMPLETED',
}

export type TransactionAsyncPayload = {
  dbname: string;
  nowait_durable: boolean;
  readonly: boolean;
  engine_name?: string;
  query: string;
  v1_inputs: Relation[];
};

export type TransactionAsync = {
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
};

export type TransactionAsyncCompact = {
  id: string;
  state: TransactionAsyncState;
};

export type TransactionMetadata = {
  relationId: string;
  types: string[];
};

export type TransactionAsyncFile = {
  name: string;
  // node-fetch parses json to a string
  file: File | string;
};

export type ArrowRelation = {
  relationId: string;
  table: Table;
};

export type TransactionAsyncResult = {
  transaction: TransactionAsyncCompact | TransactionAsync;
  metadata: TransactionMetadata[];
  problems?: Problem[];
  results: ArrowRelation[];
};
