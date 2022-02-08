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
import nock from 'nock';
import { LabeledAction, LabeledActionResult, Transaction, TransactionResult } from './transaction/types';
import { Config } from './types';
export declare const host = "example.com";
export declare const scheme = "https";
export declare const port = "443";
export declare const baseUrl: string;
export declare function getMockConfig(): Config;
export declare function makeTransactionRequest(actions: LabeledAction['action'][], database: string, engine?: string, readonly?: boolean): Transaction;
export declare function makeTransactionResult(actionResults: LabeledActionResult['result'][]): TransactionResult;
export declare function nockTransaction(actions: LabeledAction['action'][], actionResults: LabeledActionResult['result'][], database: string, engine?: string, readonly?: boolean): nock.Scope;
