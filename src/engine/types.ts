export type Engine = {
  id: string;
  name: string;
  size: string;
  region: string;
  state: string;
  created_by: string;
  requested_on: string;
  created_on: string;
  deleted_on: string;
};

export type EngineOptions = {
  id?: string | string[];
  name?: string | string[];
  size?: string | string[];
  state?: EngineState | EngineState[];
};

export enum EngineSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

export enum EngineState {
  REQUESTED = 'REQUESTED',
  PROVISIONING = 'PROVISIONING',
  REGISTERING = 'REGISTERING',
  PROVISIONED = 'PROVISIONED',
  PROVISION_FAILED = 'PROVISION_FAILED',
  DELETE_REQUESTED = 'DELETE_REQUESTED',
  STOPPING = 'STOPPING',
  DELETING = 'DELETING',
  DELETED = 'DELETED',
  DELETION_FAILED = 'DELETION_FAILED',
}
