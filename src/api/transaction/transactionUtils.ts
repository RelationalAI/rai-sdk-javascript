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

import { MaxRelationSizeError } from '../../errors';
import { MetadataInfo } from '../../proto/generated/message';
import { RelationId } from '../../proto/generated/schema';
import {
  ArrowRelation,
  ArrowResult,
  LabeledAction,
  TransactionAsyncFile,
  TransactionAsyncResult,
  TransactionAsyncState,
} from './types';

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
  const metadataProto = files.find(x => x.name === 'metadata.proto');

  if (!transaction) {
    throw new Error('transaction part not found');
  }

  // TODO uncomment and make TransactionAsyncResult.metadata required
  // if (!metadataProto) {
  //   throw new Error('metadata proto part not found');
  // }

  const metadata = metadataProto
    ? await readProtoMetadata(metadataProto.file as File)
    : undefined;

  const txn = await readJson(transaction.file);
  const result: TransactionAsyncResult = {
    transaction: txn,
    results: await makeArrowRelations(await readArrowFiles(files), metadata),
  };

  if (problems) {
    result.problems = await readJson(problems.file);
  }

  return result;
}

const MAX_ARROW_SIZE = 2147483647;

export async function readArrowFiles(files: TransactionAsyncFile[]) {
  const results: ArrowResult[] = [];

  for (const file of files) {
    if (
      typeof file.file !== 'string' &&
      file.file.type === 'application/vnd.apache.arrow.stream'
    ) {
      // See: https://github.com/apache/arrow/issues/33211
      // throwing the error here to avoid failures downstream
      if (file.file.size >= MAX_ARROW_SIZE) {
        throw new MaxRelationSizeError(
          file.name,
          file.file.size,
          MAX_ARROW_SIZE,
        );
      }

      const table = await tableFromIPC(file.file.stream());

      results.push({
        relationId: file.name,
        filename: file.file.name,
        table,
      });
    }
  }

  return results;
}

export function makeArrowRelations(
  results: ArrowResult[],
  metadata?: MetadataInfo,
) {
  const metadataMap = (metadata?.relations || []).reduce<
    Record<string, RelationId | undefined>
  >((memo, item) => {
    memo[item.fileName] = item.relationId;

    return memo;
  }, {});

  return results.map(r => {
    const metadata: RelationId = metadataMap[r.filename] || { arguments: [] };
    const relation: ArrowRelation = {
      relationId: r.relationId,
      table: r.table,
      metadata,
    };

    return relation;
  });
}

export async function readProtoMetadata(file: File | Blob) {
  if (!file?.arrayBuffer) {
    throw new Error(`Unsupported metadata type: ${typeof file}`);
  }

  try {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    return MetadataInfo.fromBinary(data);
  } catch (error: any) {
    // TODO remove it latr
    // old engines throw this error when there's no output
    // so we'll just ignore this for some time
    if (error.message === 'illegal tag: field no 0 wire type 0') {
      return { relations: [] };
    }

    throw error;
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
