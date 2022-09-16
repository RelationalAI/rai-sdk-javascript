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
  async installModels(
    database: string,
    engine: string,
    models: Model[],
    async = false,
  ) {
    const queries = models.map(model => {
      return `def insert:rel:catalog:model["${model.name}"] = """${model.value}"""`;
    });

    const rsp = async
      ? await this.execAsync(database, engine, queries.join('\n'), [], false)
      : await this.exec(database, engine, queries.join('\n'), [], false);

    return rsp.transaction;
  }

  async listModels(database: string, engine: string) {
    const rsp = await this.exec(
      database,
      engine,
      'def output = rel:catalog:model',
    );

    return rsp.results.map(result => {
      return result.table.toArray().map(model => {
        return { modelName: model.v1, src: model.v2 };
      });
    });
  }

  async getModel(database: string, engine: string, name: string) {
    const rsp = await this.exec(
      database,
      engine,
      `def output = rel:catalog:model["${name}"]`,
    );

    const src = rsp.results.map(result => {
      return result.table.toArray().map(model => {
        return model.v1;
      });
    });

    if (src.length == 0) {
      throw new Error(`Model '${name}' not found`);
    }

    return { modelName: name, src: src[0][0] };
  }

  async deleteModel(
    database: string,
    engine: string,
    name: string,
    async = false,
  ) {
    const query = `def delete:rel:catalog:model["${name}"] = rel:catalog:model["${name}"]`
    const rsp = async
      ? await this.execAsync(database, engine, query, [], false)
      : await this.exec(database, engine, query, [], false);

    return rsp.transaction;
  }
}
