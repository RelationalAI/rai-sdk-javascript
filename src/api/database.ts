// Copyright 2022 RelationalAI, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Context } from './context';

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

const ENDPOINT = 'database';

type ListReponse = { databases: Database[] };
type SingleReponse = { database: Database };
type DeleteResponse = {
  name: string;
  message: string;
};

export async function createDatabase(
  context: Context,
  name: string,
  cloneDatabase?: string,
) {
  const result = await context.put<SingleReponse>(ENDPOINT, {
    body: {
      name,
      source_name: cloneDatabase,
    },
  });

  return result.database;
}

export async function listDatabases(
  context: Context,
  options?: DatabaseOptions,
) {
  const result = await context.get<ListReponse>(ENDPOINT, options);

  return result.databases;
}

export async function getDatabase(context: Context, name: string) {
  const databases = await listDatabases(context, { name });

  return databases[0];
}

export async function deleteDatabase(context: Context, name: string) {
  const result = await context.delete<DeleteResponse>(ENDPOINT, {
    body: { name },
  });

  return result;
}
