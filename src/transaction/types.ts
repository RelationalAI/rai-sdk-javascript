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
