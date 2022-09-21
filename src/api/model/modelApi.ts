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

import _ from 'lodash';

import { ExecAsyncApi } from '../query/execAsyncApi';
import { Model } from '../transaction/types';
export class ModelApi extends ExecAsyncApi {
  async installModels(database: string, engine: string, models: Model[]) {
    const queries = models.map(model => {
      return `def insert:rel:catalog:model["${model.name}"] = """ ${model.value} """`;
    });

    const resp = await this.exec(
      database,
      engine,
      queries.join('\n'),
      [],
      false,
    );

    const diagnostics = resp.results.map(result => {
      const relationId = result.relationId;
      if (relationId.includes('/:rel/:catalog/:diagnostic')) {
        const value = result.table.toArray()[0].v2;
        if (relationId.includes('/:code')) return { code: value };
        if (relationId.includes('/:message')) return { message: value };
        if (relationId.includes('/:model')) return { model: value };
        if (relationId.includes('/:report')) return { report: value };
        if (relationId.includes('/:start/:line'))
          return { line: { start: value } };
        if (relationId.includes('/:end/:line')) return { line: { end: value } };
        if (relationId.includes('/:start/:character'))
          return { character: { start: value } };
        if (relationId.includes('/:end/:character'))
          return { character: { end: value } };
      }
    });

    return _.merge({}, ...diagnostics);
  }

  async installModelsAsync(database: string, engine: string, models: Model[]) {
    const queries = models.map(model => {
      return `def insert:rel:catalog:model["${model.name}"] = """ ${model.value} """`;
    });

    return this.execAsync(database, engine, queries.join('\n'), [], false);
  }

  async listModels(database: string, engine: string) {
    const rsp = await this.exec(
      database,
      engine,
      'def output:models[name] = rel:catalog:model(name, _)',
    );

    const models = rsp.results.map(result => {
      if (result.relationId.includes('/:output/:models')) {
        return result.table.toArray().map(col => {
          return col.v1;
        });
      }
    })[0];

    return models;
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

  async deleteModels(database: string, engine: string, names: string[]) {
    const queries = names.map(
      name =>
        `def delete:rel:catalog:model["${name}"] = rel:catalog:model["${name}"]`,
    );
    return await this.exec(database, engine, queries.join('\n'), [], false);
  }

  async deleteModelsAsync(database: string, engine: string, names: string[]) {
    const queries = names.map(
      name =>
        `def delete:rel:catalog:model["${name}"] = rel:catalog:model["${name}"]`,
    );

    return await this.execAsync(
      database,
      engine,
      queries.join('\n'),
      [],
      false,
    );
  }
}
