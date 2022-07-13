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

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { TransactionApi } from '../transaction/transactionApi';
import { makeQueryAction } from './queryUtils';
import { CsvConfigSchema, CsvConfigSyntax, QueryInput } from './types';

export class QueryApi extends TransactionApi {
  async query(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
  ) {
    const action = makeQueryAction(queryString, inputs);

    return await this.runActions(database, engine, [action], readonly);
  }

  async loadJson(
    database: string,
    engine: string,
    relation: string,
    json: any,
  ) {
    const qs = [
      `def config:data = data`,
      `def insert:${relation} = load_json[config]`,
    ];
    const inputs: QueryInput[] = [
      {
        name: 'data',
        value: JSON.stringify(json),
      },
    ];

    return this.query(database, engine, qs.join('\n'), inputs, false);
  }

  async loadCsv(
    database: string,
    engine: string,
    relation: string,
    csv: string,
    syntax?: CsvConfigSyntax,
    schema?: CsvConfigSchema,
  ) {
    const qs = [`def config:data = data`];
    const inputs: QueryInput[] = [
      {
        name: 'data',
        value: csv,
      },
    ];

    if (syntax) {
      qs.push(...syntaxToRel(syntax));
    }

    if (schema) {
      qs.push(...schemaToRel(schema));
    }

    qs.push(`def insert:${relation} = load_csv[config]`);

    return this.query(database, engine, qs.join('\n'), inputs, false);
  }
}

function toRelLiteral(value: any) {
  if (typeof value === 'string') {
    if (value.length === 1) {
      const escapedValue = value.replace(/'/g, "\\'");

      return `'${escapedValue}'`;
    }

    const escapedValue = value.replace(/"/g, '\\"');

    return `"${escapedValue}"`;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
}

function syntaxToRel(syntax: CsvConfigSyntax) {
  const qs: string[] = [];

  Object.keys(syntax).forEach(k => {
    const prop = k as keyof CsvConfigSyntax;

    if (prop === 'header') {
      const headerStr = Object.keys(syntax.header!)
        .map(key => {
          return `(${key}, ${toRelLiteral(syntax.header![key])})`;
        })
        .join('; ');
      qs.push(`def config:syntax:header = ${headerStr}`);
    } else {
      qs.push(`def config:syntax:${prop} = ${toRelLiteral(syntax[prop])}`);
    }
  });

  return qs;
}

function schemaToRel(schema: CsvConfigSchema) {
  const qs: string[] = [];

  Object.keys(schema).forEach(colName => {
    qs.push(`def config:schema${colName} = ${toRelLiteral(schema[colName])}`);
  });

  return qs;
}
