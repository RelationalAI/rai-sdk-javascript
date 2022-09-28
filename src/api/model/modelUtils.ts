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

import { RelationId } from '../../proto/generated/schema';
import { Model } from '../transaction/types';

export function makeModel(name: string, value: string) {
  const model: Model = {
    name,
    value,
  };

  return model;
}

// gets the model output name from protobuf
export function getModelOutputFromProto(relationId: RelationId) {
  if (relationId.arguments.length > 1) {
    const val = relationId.arguments[1].constantType?.value?.arguments[0].value;

    if (val !== undefined && val.oneofKind === 'stringVal') {
      return new TextDecoder().decode(val.stringVal);
    }
  }

  return undefined;
}
