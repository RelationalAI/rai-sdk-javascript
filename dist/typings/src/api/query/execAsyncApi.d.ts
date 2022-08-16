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
import { TransactionAsyncApi } from '../transaction/transactionAsyncApi';
import { TransactionAsyncCompact, TransactionAsyncResult } from '../transaction/types';
import { QueryInput } from './types';
export declare class ExecAsyncApi extends TransactionAsyncApi {
    execAsync(database: string, engine: string, queryString: string, inputs?: QueryInput[], readonly?: boolean, tags?: string[]): Promise<TransactionAsyncResult | {
        transaction: TransactionAsyncCompact;
    }>;
    exec(database: string, engine: string, queryString: string, inputs?: QueryInput[], readonly?: boolean, tags?: string[], interval?: number, // 1 second
    timeout?: number): Promise<TransactionAsyncResult>;
    pollTransaction(txnId: string, interval?: number, timeout?: number): Promise<TransactionAsyncResult>;
}
