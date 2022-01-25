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
  InstallAction,
  ListSourceAction,
  Model,
  ModifyWorkspaceAction,
  runActions,
} from './transaction';

export function mkModel(name: string, value: string) {
  const model: Model = {
    type: 'Source',
    name,
    value,
    path: name,
  };

  return model;
}

export async function installModels(
  context: Context,
  database: string,
  engine: string,
  models: Model[],
) {
  const action: InstallAction = {
    type: 'InstallAction',
    sources: models,
  };
  const result = await runActions(context, database, engine, [action], false);

  if (result.actions[0]?.result?.type === 'InstallActionResult') {
    return result.actions[0].result;
  }

  throw new Error('InstallActionResult is missing');
}

export async function listModels(
  context: Context,
  database: string,
  engine: string,
) {
  const action: ListSourceAction = {
    type: 'ListSourceAction',
  };
  const result = await runActions(context, database, engine, [action]);

  if (result.actions[0]?.result?.type === 'ListSourceActionResult') {
    return result.actions[0].result.sources;
  }

  throw new Error('ListSourceActionResult is missing');
}

export async function getModel(
  context: Context,
  database: string,
  engine: string,
  name: string,
) {
  const models = await listModels(context, database, engine);
  const model = models.find(m => m.name === name);

  if (model) {
    return model;
  }

  throw new Error(`Model '${name}' not found`);
}

export async function deleteModel(
  context: Context,
  database: string,
  engine: string,
  name: string,
) {
  const action: ModifyWorkspaceAction = {
    type: 'ModifyWorkspaceAction',
    delete_source: [name],
  };
  const result = await runActions(context, database, engine, [action], false);

  if (result.actions[0]?.result?.type === 'ModifyWorkspaceActionResult') {
    return result.actions[0].result;
  }

  throw new Error('ModifyWorkspaceActionResult is missing');
}
