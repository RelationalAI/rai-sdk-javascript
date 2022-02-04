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

import { makeModel } from '../model/modelUtils';
import { QueryAction, Relation, RelValue } from '../transaction/types';
import { QueryInput } from './types';

export function makeQueryAction(
  queryString: string,
  inputs: QueryInput[] = [],
) {
  const action: QueryAction = {
    type: 'QueryAction',
    outputs: [],
    persist: [],
    source: makeModel('query', queryString),
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
