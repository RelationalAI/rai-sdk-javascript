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

import { QueryAction, Relation, RelValue } from '../transaction/types';
import { CsvConfigSchema, CsvConfigSyntax, QueryInput } from './types';

export function makeQueryAction(
  queryString: string,
  inputs: QueryInput[] = [],
) {
  const action: QueryAction = {
    type: 'QueryAction',
    outputs: [],
    persist: [],
    source: {
      type: 'Source',
      name: 'query',
      value: queryString,
      path: '',
    },
    inputs: inputs.map(input => makeQueryInput(input.name, input.value)),
  };

  return action;
}

export const makeQueryInput = (name: string, value: RelValue) => {
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

export function syntaxToRel(syntax: CsvConfigSyntax) {
  const qs: string[] = [];

  Object.keys(syntax).forEach(k => {
    const prop = k as keyof CsvConfigSyntax;

    if (prop === 'header') {
      const headerStr = Object.keys(syntax.header!)
        .map(key => {
          return `(${key}, :${toRelLiteral(syntax.header![key])})`;
        })
        .join('; ');
      qs.push(`def config[:syntax, :header]: { ${headerStr} }`);
    } else {
      qs.push(`def config[:syntax, :${prop}]: ${toRelLiteral(syntax[prop])}`);
    }
  });

  return qs;
}

export function schemaToRel(schema: CsvConfigSchema) {
  const qs: string[] = [];

  Object.keys(schema).forEach(colName => {
    qs.push(
      `def config[:schema, ${colName}]: ${toRelLiteral(schema[colName])}`,
    );
  });

  return qs;
}
