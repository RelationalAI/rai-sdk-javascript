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

import { Base, BaseOptions } from '../base';
import { Database, DatabaseOptions } from './types';

const ENDPOINT = 'database';

type ListReponse = { databases: Database[] };
type SingleReponse = { database: Database };
type DeleteResponse = {
  name: string;
  message: string;
};

export class DatabaseApi extends Base {
  async createDatabase(
    name: string,
    cloneDatabase?: string,
    { signal }: BaseOptions = {},
  ) {
    const result = await this.put<SingleReponse>(ENDPOINT, {
      body: {
        name,
        source_name: cloneDatabase,
      },
      signal,
    });

    return result.database;
  }

  async listDatabases(options?: DatabaseOptions, { signal }: BaseOptions = {}) {
    const result = await this.get<ListReponse>(ENDPOINT, {
      query: options,
      signal,
    });

    return result.databases;
  }

  async getDatabase(name: string, { signal }: BaseOptions = {}) {
    const databases = await this.listDatabases({ name }, { signal });

    return databases[0];
  }

  async deleteDatabase(name: string, { signal }: BaseOptions = {}) {
    const result = await this.delete<DeleteResponse>(ENDPOINT, {
      body: { name },
      signal,
    });

    return result;
  }
}
