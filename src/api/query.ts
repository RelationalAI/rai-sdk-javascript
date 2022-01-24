/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { mkModel } from './model';
import { QueryAction, Relation, RelValue, runActions } from './transaction';

export type QueryInput = {
  name: string;
  value: RelValue;
};

export function mkQueryAction(queryString: string, inputs: QueryInput[] = []) {
  const action: QueryAction = {
    type: 'QueryAction',
    outputs: [],
    persist: [],
    source: mkModel('query', queryString),
    inputs: inputs.map(input => mkQueryInput(input.name, input.value)),
  };

  return action;
}

export const mkQueryInput = (name: string, value: RelValue) => {
  const input: Relation = {
    rel_key: {
      values: [],
      name: name,
      keys: ['RAI_VariableSizeStrings.VariableSizeString'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[value]],
  };

  return input;
};

export async function query(
  context: Context,
  database: string,
  engine: string,
  queryString: string,
  inputs: QueryInput[] = [],
  readonly = true,
) {
  const action = mkQueryAction(queryString, inputs);
  const result = await runActions(
    context,
    database,
    engine,
    [action],
    readonly,
  );

  if (result.actions[0]?.result?.type === 'QueryActionResult') {
    return result.output.filter(r => r.rel_key.name === 'output');
  }

  throw new Error('QueryActionResult is missing');
}

export async function loadJson(
  context: Context,
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

  return query(context, database, engine, qs.join('\n'), inputs, false);
}

export type CsvConfigSyntax = {
  header?: {
    [colNumber: string]: string;
  };
  header_row?: number;
  delim?: string;
  quotechar?: string;
  escapechar?: string;
};

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

export type CsvConfigSchema = {
  [colName: string]: string;
};

function schemaToRel(schema: CsvConfigSchema) {
  const qs: string[] = [];

  Object.keys(schema).forEach(colName => {
    qs.push(`def config:schema${colName} = ${toRelLiteral(schema[colName])}`);
  });

  return qs;
}

export async function loadCsv(
  context: Context,
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

  return query(context, database, engine, qs.join('\n'), inputs, false);
}
