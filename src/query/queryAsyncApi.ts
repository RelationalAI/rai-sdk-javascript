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
import { isTransactionDone } from '../transaction/transactionUtils';
import {
  TransactionAsyncCompact,
  TransactionAsyncPayload,
  TransactionAsyncResult,
} from '../transaction/types';
import { makeQueryInput } from './queryUtils';
import { QueryInput } from './types';

export class QueryAsyncApi extends TransactionAsyncApi {
  async queryAsync(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
  ) {
    const transaction: TransactionAsyncPayload = {
      dbname: database,
      query: queryString,
      nowait_durable: false,
      readonly,
      inputs: inputs.map(input => makeQueryInput(input.name, input.value)),
    };

    if (engine) {
      transaction.engine_name = engine;
    }

    return await this.runTransactionAsync(transaction);
  }

  async queryPoll(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
    interval = 3 * 1000, // 3 seconds
    timeout = 120 * 1000, // 2 mins
  ) {
    const result = await this.queryAsync(
      database,
      engine,
      queryString,
      inputs,
      readonly,
    );
    const txnId = result.transaction.id;
    const startedAt = Date.now();

    if ('results' in result) {
      return result;
    }

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

    const res: TransactionAsyncResult = {
      transaction: transaction!,
      metadata: data[0],
      problems: data[1],
      results: data[2],
    };

    return res;
  }
}
