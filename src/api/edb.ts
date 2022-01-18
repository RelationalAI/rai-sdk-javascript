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
import {
  ListEdbAction,
  ModifyWorkspaceAction,
  runActions,
} from './transaction';

export async function listEdbs(
  context: Context,
  database: string,
  engine: string,
) {
  const action: ListEdbAction = {
    type: 'ListEdbAction',
  };
  const result = await runActions(context, database, engine, [action]);

  if (result.actions[0]?.result?.type === 'ListEdbActionResult') {
    return result.actions[0].result.rels;
  }

  throw new Error('ListEdbActionResult is missing');
}

export async function deleteEdb(
  context: Context,
  database: string,
  engine: string,
  name: string,
) {
  const action: ModifyWorkspaceAction = {
    type: 'ModifyWorkspaceAction',
    delete_edb: name,
  };
  const result = await runActions(context, database, engine, [action], false);

  if (result.actions[0]?.result?.type === 'ModifyWorkspaceActionResult') {
    return result.actions[0].result.delete_edb_result;
  }

  throw new Error('ModifyWorkspaceActionResult is missing');
}
