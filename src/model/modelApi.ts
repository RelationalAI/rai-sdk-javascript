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

import { TransactionApi } from '../transaction/transactionApi';
import {
  InstallAction,
  ListSourceAction,
  Model,
  ModifyWorkspaceAction,
} from '../transaction/types';

export class ModelApi extends TransactionApi {
  async installModels(database: string, engine: string, models: Model[]) {
    const action: InstallAction = {
      type: 'InstallAction',
      sources: models,
    };
    const result = await this.runActions(database, engine, [action], false);

    if (result.actions[0]?.result?.type === 'InstallActionResult') {
      return result.actions[0].result;
    }

    throw new Error('InstallActionResult is missing');
  }

  async listModels(database: string, engine: string) {
    const action: ListSourceAction = {
      type: 'ListSourceAction',
    };
    const result = await this.runActions(database, engine, [action]);

    if (result.actions[0]?.result?.type === 'ListSourceActionResult') {
      return result.actions[0].result.sources;
    }

    throw new Error('ListSourceActionResult is missing');
  }

  async getModel(database: string, engine: string, name: string) {
    const models = await this.listModels(database, engine);
    const model = models.find(m => m.name === name);

    if (model) {
      return model;
    }

    throw new Error(`Model '${name}' not found`);
  }

  async deleteModel(database: string, engine: string, name: string) {
    const action: ModifyWorkspaceAction = {
      type: 'ModifyWorkspaceAction',
      delete_source: [name],
    };
    const result = await this.runActions(database, engine, [action], false);

    if (result.actions[0]?.result?.type === 'ModifyWorkspaceActionResult') {
      return result.actions[0].result;
    }

    throw new Error('ModifyWorkspaceActionResult is missing');
  }
}
