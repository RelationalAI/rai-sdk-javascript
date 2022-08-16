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
import { LabeledAction, Transaction, TransactionMode, TransactionResult } from './types';
export declare class TransactionApi extends Base {
    runTransaction(database: string, engine: string, transaction: Transaction, mode?: TransactionMode): Promise<TransactionResult>;
    runActions(database: string, engine: string, actions: LabeledAction['action'][], readonly?: boolean): Promise<TransactionResult>;
}
