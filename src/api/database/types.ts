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

export type Database = {
  id: string;
  name: string;
  account_name: string;
  state: DatabaseState;
  region: string;
  created_by: string;
  created_on: string;
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
