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

import { ExecAsyncApi } from '../query/execAsyncApi';
import { Model } from '../transaction/types';
export class ModelApi extends ExecAsyncApi {
  async installModels(database: string, engine: string, models: Model[]) {
    const queries = models.map(model => {
      return `def insert:rel:catalog:model["${model.name}"] = """ ${model.value} """`;
    });

    return await this.exec(database, engine, queries.join('\n'), [], false);
  }

  async installModelsAsync(database: string, engine: string, models: Model[]) {
    const queries = models.map(model => {
      return `def insert:rel:catalog:model["${model.name}"] = """ ${model.value} """`;
    });

    return this.execAsync(database, engine, queries.join('\n'), [], false);
  }

  async listModels(database: string, engine: string) {
    let rsp = await this.exec(
      database,
      engine,
      'def output:models = rel:catalog:model',
    );

    const models = rsp.results.map(result => {
      if (result.relationId.includes('/:output/:models')) {
        return result.table.toArray().map(col => {
          return { name: col.v1, value: col.v2 } as Model;
        });
      }
    })[0];

    // dummy query to get problems
    rsp = await this.exec(database, engine, 'def output = 1');
    return { models: models, diagnostics: rsp.problems };
  }

  async getModel(database: string, engine: string, name: string) {
    const rsp = await this.exec(
      database,
      engine,
      `def output:model = rel:catalog:model["${name}"]`,
    );

    const value = rsp.results.map(result => {
      if (result.relationId.includes('/:output/:model')) {
        return result.table.toArray().map(col => {
          return col.v1;
        });
      }
    });

    if (value.length == 0 || value[0] == undefined) {
      throw new Error(`Model '${name}' not found`);
    }

    return { name: name, value: value[0][0] } as Model;
  }

  async deleteModel(database: string, engine: string, name: string) {
    const query = `def delete:rel:catalog:model["${name}"] = rel:catalog:model["${name}"]`;
    return await this.exec(database, engine, query, [], false);
  }

  async deleteModelAsync(database: string, engine: string, name: string) {
    const query = `def delete:rel:catalog:model["${name}"] = rel:catalog:model["${name}"]`;
    return this.execAsync(database, engine, query, [], false);
  }
}
