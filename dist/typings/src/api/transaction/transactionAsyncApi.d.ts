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
import { Problem, TransactionAsync, TransactionAsyncCompact, TransactionAsyncPayload, TransactionListOptions } from './types';
declare type CancelResponse = {
    message?: string;
};
export declare class TransactionAsyncApi extends Base {
    runTransactionAsync(transaction: TransactionAsyncPayload): Promise<import("./types").TransactionAsyncResult | {
        transaction: TransactionAsyncCompact;
    }>;
    listTransactions(options?: TransactionListOptions): Promise<TransactionAsync[]>;
    getTransaction(transactionId: string): Promise<TransactionAsync>;
    getTransactionResults(transactionId: string): Promise<import("./types").ArrowResult[]>;
    getTransactionMetadata(transactionId: string): Promise<import("../../../index.web").MetadataInfo>;
    getTransactionProblems(transactionId: string): Promise<Problem[]>;
    cancelTransaction(transactionId: string): Promise<CancelResponse>;
}
export {};
