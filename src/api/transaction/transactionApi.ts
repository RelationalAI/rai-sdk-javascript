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
import { makeLabeledAction } from './transactionUtils';
import {
  LabeledAction,
  Transaction,
  TransactionMode,
  TransactionResult,
} from './types';

const ENDPOINT = 'transaction';

export class TransactionApi extends Base {
  async runTransaction(
    database: string,
    engine: string,
    transaction: Transaction,
    mode = TransactionMode.OPEN,
  ) {
    const query = {
      dbname: database,
      compute_name: engine,
      open_mode: mode,
      region: this.region,
    };

    return await this.post<TransactionResult>(ENDPOINT, {
      query,
      body: transaction,
    });
  }

  async runActions(
    database: string,
    engine: string,
    actions: LabeledAction['action'][],
    readonly = true,
  ) {
    const labeledActions = actions.map((action, i) =>
      makeLabeledAction(`action-${i}`, action),
    );
    const transaction: Transaction = {
      type: 'Transaction',
      abort: false,
      dbname: database,
      mode: TransactionMode.OPEN,
      nowait_durable: false,
      readonly,
      version: 0,
      actions: labeledActions,
      computeName: engine,
    };

    return await this.runTransaction(database, engine, transaction);
  }
}
