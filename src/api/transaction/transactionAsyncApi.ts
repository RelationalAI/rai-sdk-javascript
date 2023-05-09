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

import { RequestOptions } from '../../rest';
import { Base } from '../base';
import {
  readArrowFiles,
  readProtoMetadata,
  readTransactionResult,
} from './transactionUtils';
import {
  Problem,
  TransactionAsync,
  TransactionAsyncCompact,
  TransactionAsyncFile,
  TransactionAsyncPayload,
  TransactionListOptions,
} from './types';

const ENDPOINT = 'transactions';

type ListResponse = { transactions: TransactionAsync[] };
type SingleResponse = { transaction: TransactionAsync };
type CancelResponse = {
  message?: string;
};

export class TransactionAsyncApi extends Base {
  async runTransactionAsync(transaction: TransactionAsyncPayload) {
    const result = await this.post<
      TransactionAsyncCompact | TransactionAsyncFile[]
    >(ENDPOINT, {
      body: transaction,
    });

    if (Array.isArray(result)) {
      return await readTransactionResult(result);
    }

    return {
      transaction: result,
    };
  }

  async listTransactions(options?: TransactionListOptions) {
    const result = await this.get<ListResponse>(ENDPOINT, { query: options });

    return result.transactions;
  }

  async getTransaction(
    transactionId: string,
    { signal }: Pick<RequestOptions, 'signal'> = {},
  ) {
    const result = await this.get<SingleResponse>(
      `${ENDPOINT}/${transactionId}`,
      { signal },
    );

    return result.transaction;
  }

  async getTransactionResults(
    transactionId: string,
    { signal }: Pick<RequestOptions, 'signal'> = {},
  ) {
    const result = await this.get<TransactionAsyncFile[]>(
      `${ENDPOINT}/${transactionId}/results`,
      { signal },
    );

    return await readArrowFiles(result);
  }

  async getTransactionMetadata(
    transactionId: string,
    { signal }: Pick<RequestOptions, 'signal'> = {},
  ) {
    const result = await this.request<Blob>(
      `${ENDPOINT}/${transactionId}/metadata`,
      {
        method: 'GET',
        headers: { Accept: 'application/x-protobuf' },
        signal,
      },
    );

    return readProtoMetadata(result);
  }

  async getTransactionProblems(
    transactionId: string,
    { signal }: Pick<RequestOptions, 'signal'> = {},
  ) {
    const result = await this.get<Problem[]>(
      `${ENDPOINT}/${transactionId}/problems`,
      { signal },
    );

    return result;
  }

  async getTransactionQuery(transactionId: string) {
    const result = await this.get<string>(`${ENDPOINT}/${transactionId}/query`);

    return result;
  }

  async cancelTransaction(transactionId: string) {
    const result = await this.post<CancelResponse>(
      `${ENDPOINT}/${transactionId}/cancel`,
      {},
    );

    return result || {};
  }
}
