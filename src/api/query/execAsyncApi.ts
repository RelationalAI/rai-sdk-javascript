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

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { TransactionAsyncApi } from '../transaction/transactionAsyncApi';
import {
  isTransactionDone,
  makeArrowRelations,
} from '../transaction/transactionUtils';
import {
  TransactionAsyncCompact,
  TransactionAsyncPayload,
  TransactionAsyncResult,
} from '../transaction/types';
import { makeQueryInput } from './queryUtils';
import { QueryInput } from './types';

export class ExecAsyncApi extends TransactionAsyncApi {
  async execAsync(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
    tags: string[] = [],
  ) {
    const transaction: TransactionAsyncPayload = {
      dbname: database,
      query: queryString,
      nowait_durable: false,
      readonly,
      v1_inputs: inputs.map(input => makeQueryInput(input.name, input.value)),
      tags,
    };

    if (engine) {
      transaction.engine_name = engine;
    }

    return await this.runTransactionAsync(transaction);
  }

  async exec(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
    tags: string[] = [],
    interval = 1000, // 1 second
    timeout = Number.POSITIVE_INFINITY,
  ) {
    const result = await this.execAsync(
      database,
      engine,
      queryString,
      inputs,
      readonly,
      tags,
    );
    const txnId = result.transaction.id;

    if ('results' in result) {
      return result;
    }

    return await this.pollTransaction(txnId, interval, timeout);
  }

  async pollTransaction(
    txnId: string,
    interval = 1000,
    timeout = Number.POSITIVE_INFINITY,
  ) {
    const startedAt = Date.now();

    let transaction: TransactionAsyncCompact;

    await new Promise<void>((resolve, reject) => {
      const checkState = () => {
        setTimeout(async () => {
          transaction = await this.getTransaction(txnId);

          if (isTransactionDone(transaction.state)) {
            resolve();
          } else {
            if (Date.now() - startedAt > timeout) {
              reject(
                new Error(
                  `Polling transaction timeout of ${timeout}ms has been exceeded.`,
                ),
              );
            }

            checkState();
          }
        }, interval);
      };

      checkState();
    });

    const data = await Promise.all([
      this.getTransactionMetadata(txnId),
      this.getTransactionProblems(txnId),
      this.getTransactionResults(txnId),
    ]);
    const results = await makeArrowRelations(data[2], data[0]);

    const res: TransactionAsyncResult = {
      transaction: transaction!,
      problems: data[1],
      results,
    };

    return res;
  }
}
