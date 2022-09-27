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
import { QueryInput } from '../query/types';
import { Model } from '../transaction/types';
export class ModelApi extends ExecAsyncApi {
  async installModels(database: string, engine: string, models: Model[]) {
    const randInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const queries: string[] = [];
    const queryInputs: QueryInput[] = [];

    models.map(model => {
      const inputName = `${model.name}_input_${randInt}`;
      queryInputs.push({ name: inputName, value: model.value });
      queries.push(`def delete:rel:catalog:model["${model.name}"] = rel:catalog:model["${model.name}"]
        def insert:rel:catalog:model["${model.name}"] = ${inputName}`);
    });

    return await this.exec(
      database,
      engine,
      queries.join('\n'),
      queryInputs,
      false,
    );
  }

  async installModelsAsync(database: string, engine: string, models: Model[]) {
    const randInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const queries: string[] = [];
    const queryInputs: QueryInput[] = [];

    models.map(model => {
      const inputName = `${model.name}_input_${randInt}`;
      queryInputs.push({ name: inputName, value: model.value });
      queries.push(`def delete:rel:catalog:model["${model.name}"] = rel:catalog:model["${model.name}"]
        def insert:rel:catalog:model["${model.name}"] = ${inputName}`);
    });

    return await this.execAsync(
      database,
      engine,
      queries.join('\n'),
      queryInputs,
      false,
    );
  }

  async listModels(database: string, engine: string) {
    const randInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const outName = `models${randInt}`;
    const rsp = await this.exec(
      database,
      engine,
      `def output:${outName}[name] = rel:catalog:model(name, _)`,
    );

    const result = rsp.results.find(r => {
      const val =
        r.metadata.arguments[1].constantType?.value?.arguments[0].value;
      if (val?.oneofKind === 'stringVal') {
        const stringVal = new TextDecoder().decode(val.stringVal);
        if (stringVal.includes(outName)) {
          return true;
        }
      }
    });

    const models = result?.table.toArray().map(c => c.v1);
    return models;
  }

  async getModel(database: string, engine: string, name: string) {
    const randInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const outName = `model${randInt}`;
    const rsp = await this.exec(
      database,
      engine,
      `def output:${outName} = rel:catalog:model["${name}"]`,
    );

    const result = rsp.results.find(r => {
      const val =
        r.metadata.arguments[1].constantType?.value?.arguments[0].value;
      if (val?.oneofKind === 'stringVal') {
        const stringVal = new TextDecoder().decode(val.stringVal);
        if (stringVal.includes(outName)) {
          return true;
        }
      }
    });

    const value = result?.table.get(0)?.toArray()[0];

    if (value === undefined) {
      throw new Error(`Model '${name}' not found`);
    }

    const model: Model = { name: name, value: value };
    return model;
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
