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
    return result.actions[0].result.output;
  }

  throw new Error('QueryActionResult is missing');
}
