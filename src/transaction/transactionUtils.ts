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

import { tableFromIPC } from 'apache-arrow';

import {
  ArrowRelation,
  LabeledAction,
  TransactionAsyncFile,
  TransactionAsyncResult,
} from '../transaction/types';

export function makeLabeledAction(
  name: string,
  action: LabeledAction['action'],
) {
  const labeledAction: LabeledAction = {
    type: 'LabeledAction',
    name: name,
    action,
  };

  return labeledAction;
}

export async function readTransactionResult(files: TransactionAsyncFile[]) {
  const transaction = files.find(x => x.name === 'transaction');

  if (!transaction) {
    throw new Error('transaction part not found');
  }

  const txn = readJson(transaction.data);
  const result: TransactionAsyncResult = {
    id: txn.id,
    state: txn.state,
  };

  const relations: ArrowRelation[] = [];

  for (const file of files) {
    if (file.contentType === 'application/vnd.apache.arrow.stream') {
      const table = await tableFromIPC(file.data);

      relations.push({
        relationId: file.name,
        table,
      });
    }
  }

  result.relations = relations;

  return result;
}

function readJson(data: Uint8Array) {
  const str = new TextDecoder().decode(data);

  return JSON.parse(str);
}
