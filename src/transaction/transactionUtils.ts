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
import { MetadataInfo } from '../proto/generated/message';

import {
  ArrowRelation,
  LabeledAction,
  TransactionAsyncFile,
  TransactionAsyncResult,
  TransactionAsyncState,
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
  const problems = files.find(x => x.name === 'problems');
  const metadata = files.find(x => x.name === 'metadata');
  const metadataInfo = files.find(x => x.name === 'metadata_info')

  if (!transaction) {
    throw new Error('transaction part not found');
  }

  if (!metadata) {
    throw new Error('metadata part not found');
  }

  if (!metadataInfo) {
    throw new Error('metadata info part not found')
  }

  const txn = await readJson(transaction.file);
  const result: TransactionAsyncResult = {
    transaction: txn,
    results: await readArrowFiles(files),
    metadata: await readJson(metadata.file),
    metadataInfo: await readProtoMetadata(metadataInfo.file),
  };

  readProtoMetadata(metadataInfo.file)

  if (problems) {
    result.problems = await readJson(problems.file);
  }

  return result;
}

export async function readArrowFiles(files: TransactionAsyncFile[]) {
  const results: ArrowRelation[] = [];

  for (const file of files) {
    if (
      typeof file.file !== 'string' &&
      file.file.type === 'application/vnd.apache.arrow.stream'
    ) {
      const table = await tableFromIPC(file.file.stream());

      results.push({
        relationId: file.name,
        table,
      });
    }
  }

  return results;
}

export async function readProtoMetadata(file: File | string) {
  if (typeof file === 'string') {
    const data = new Uint8Array(file.length)
    for (let i = 0; i < data.length; i++) {
      data[i] = file.charCodeAt(i)
    }

    return MetadataInfo.fromBinary(data)
  } else {
    throw new Error('unsupported metadata type File')
  }
}

async function readJson(file: File | string) {
  let str;

  if (typeof file === 'string') {
    str = file;
  } else {
    const data = await file.arrayBuffer();

    str = new TextDecoder().decode(data);
  }

  return JSON.parse(str);
}

export function isTransactionDone(state: TransactionAsyncState) {
  return (
    state === TransactionAsyncState.ABORTED ||
    state === TransactionAsyncState.COMPLETED
  );
}
