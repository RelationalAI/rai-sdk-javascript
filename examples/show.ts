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

import {
  ArrowRelation,
  MetadataInfo,
  ResultTable,
  TransactionAsyncCompact,
  TransactionAsyncResult,
} from '../index.node';

export function show(data: any) {
  if (data?.relations) {
    try {
      data = MetadataInfo.toJson(data);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  console.log(JSON.stringify(data, undefined, 2));
}

export function showTransactionResult(
  result:
    | TransactionAsyncResult
    | { transaction: TransactionAsyncCompact }
    | ArrowRelation[],
) {
  if (Array.isArray(result)) {
    showArrow(result);

    return;
  }

  const copy = {
    ...result,
  } as any;

  delete copy.results;
  delete copy.metadata;

  show(copy);

  if ('metadata' in result) {
    show(result.metadata);
  }

  if ('results' in result) {
    showResults(result);
  }
}

function showResults(result: TransactionAsyncResult) {
  result.results.forEach(relation => {
    const resultTable = new ResultTable(relation);

    console.log(relation.relationId);
    console.table(resultTable.toJS('displayValue'));
    console.log();
  });
}

function showArrow(results: ArrowRelation[]) {
  results.forEach(relation => {
    console.log(relation.relationId);
    console.table(relation.table.toArray());
    console.log();
  });
}
