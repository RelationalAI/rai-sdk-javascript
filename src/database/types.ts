export type Database = {
  id: string;
  name: string;
  state: DatabaseState;
  region: string;
  created_by: string;
};

export type DatabaseOptions = {
  id?: string | string[];
  name?: string | string[];
  state?: DatabaseState | DatabaseState[];
};

export enum DatabaseState {
  CREATED = 'CREATED',
  CREATING = 'CREATING',
  CREATION_FAILED = 'CREATION_FAILED',
  DELETED = 'DELETED',
}
