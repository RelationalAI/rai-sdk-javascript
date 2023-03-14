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

import { BaseOptions } from '../base';
import { TransactionApi } from '../transaction/transactionApi';
import { ListEdbAction, ModifyWorkspaceAction } from '../transaction/types';

export class EdbApi extends TransactionApi {
  async listEdbs(
    database: string,
    engine: string,
    { signal }: BaseOptions = {},
  ) {
    const action: ListEdbAction = {
      type: 'ListEdbAction',
    };
    const result = await this.runActions(database, engine, [action], true, {
      signal,
    });

    if (result.actions[0]?.result?.type === 'ListEdbActionResult') {
      return result.actions[0].result.rels;
    }

    throw new Error('ListEdbActionResult is missing');
  }

  async deleteEdb(
    database: string,
    engine: string,
    name: string,
    { signal }: BaseOptions = {},
  ) {
    const action: ModifyWorkspaceAction = {
      type: 'ModifyWorkspaceAction',
      delete_edb: name,
    };
    const result = await this.runActions(database, engine, [action], false, {
      signal,
    });

    if (result.actions[0]?.result?.type === 'ModifyWorkspaceActionResult') {
      return result.actions[0].result.delete_edb_result;
    }

    throw new Error('ModifyWorkspaceActionResult is missing');
  }
}
