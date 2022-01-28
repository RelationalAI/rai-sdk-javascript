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
