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

import { Base } from '../base';
import {
  TransactionAsync,
  TransactionAsyncCompact,
  TransactionAsyncFile,
  TransactionAsyncPayload,
  TransactionMetadata,
} from './types';

const ENDPOINT = 'transactions';

type ListReponse = { transactions: TransactionAsync[] };
type SingleReponse = { transaction: TransactionAsync };
type DeleteResponse = {
  txn_id: string;
  message: string;
};

export class TransactionAsyncApi extends Base {
  async runTransactionAsync(transaction: TransactionAsyncPayload) {
    const result = await this.post<
      TransactionAsyncCompact | TransactionAsyncFile[]
    >(ENDPOINT, {
      body: transaction,
    });

    return result;
  }

  async listTransactions() {
    const result = await this.get<ListReponse>(ENDPOINT);

    return result.transactions;
  }

  async getTransaction(transactionId: string) {
    const result = await this.get<SingleReponse>(
      `${ENDPOINT}/${transactionId}`,
    );

    return result.transaction;
  }

  async getTransactionResults(transactionId: string) {
    const result = await this.get<TransactionAsyncFile[]>(
      `${ENDPOINT}/${transactionId}/results`,
    );

    return result;
  }

  async getTransactionMetadata(transactionId: string) {
    const result = await this.get<TransactionMetadata[]>(
      `${ENDPOINT}/${transactionId}/metadata`,
    );

    return result;
  }

  async deleteTransaction(transactionId: string) {
    const result = await this.delete<DeleteResponse>(
      `${ENDPOINT}/${transactionId}`,
      {},
    );

    return result;
  }
}
