import { Model } from '../transaction/types';

export function makeModel(name: string, value: string) {
  const model: Model = {
    type: 'Source',
    name,
    value,
    path: name,
  };

  return model;
}
