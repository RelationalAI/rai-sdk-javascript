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

import Client from './api/client';
import { DatabaseState } from './api/database/types';
import { EngineState } from './api/engine/types';
import {
  LabeledAction,
  LabeledActionResult,
  Transaction,
  TransactionMode,
  TransactionResult,
} from './api/transaction/types';
import { GetTokenCredentials } from './credentials';
import { makeUrl } from './rest';
import { Config } from './types';

export const host = 'example.com';
export const scheme = 'https';
export const port = '443';
export const baseUrl = makeUrl(scheme, host, port);

export function getMockConfig() {
  const credentials = new GetTokenCredentials(() =>
    Promise.resolve('mock token'),
  );
  const config: Config = {
    host,
    port,
    scheme,
    credentials,
  };

  return config;
}

export function makeTransactionRequest(
  actions: LabeledAction['action'][],
  database: string,
  engine?: string,
  readonly = true,
) {
  const request: Transaction = {
    type: 'Transaction',
    abort: false,
    dbname: database,
    mode: TransactionMode.OPEN,
    nowait_durable: false,
    readonly,
    version: 0,
    actions: actions.map((a, i) => ({
      type: 'LabeledAction',
      name: `action-${i}`,
      action: a,
    })),
    computeName: engine,
  };

  return request;
}

export function makeTransactionResult(
  actionResults: LabeledActionResult['result'][],
) {
  const result: TransactionResult = {
    type: 'TransactionResult',
    aborted: false,
    debug_level: 0,
    version: 0,
    output: [],
    problems: [],
    actions: actionResults.map((ar, i) => ({
      type: 'LabeledActionResult',
      name: `result-${i}`,
      result: ar,
    })),
  };

  return result;
}

export function nockTransaction(
  actions: LabeledAction['action'][],
  actionResults: LabeledActionResult['result'][],
  database: string,
  engine?: string,
  readonly = true,
) {
  const request = makeTransactionRequest(actions, database, engine, readonly);
  const response = makeTransactionResult(actionResults);
  const scope = nock(baseUrl)
    .post('/transaction', request)
    .query({
      dbname: database,
      open_mode: 'OPEN',
      region: 'us-east',
      compute_name: engine,
    })
    .reply(200, response);

  return scope;
}

export async function createEngineIfNotExists(
  client: Client,
  engineName: string,
  timeout: number = 1000 * 60 * 10,
): Promise<void> {
  const checkEngine = async () => {
    const engine = await client.getEngine(engineName);

    return !!engine && engine.state === EngineState.PROVISIONED;
  };

  if (await checkEngine()) {
    return;
  }

  await client.createEngine(engineName);

  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const poll = () => {
      setTimeout(async () => {
        if (await checkEngine()) {
          resolve();
        } else if (Date.now() - startedAt > timeout) {
          reject(`Timeout provisioning ${engineName} ${timeout}ms`);
        } else {
          poll();
        }
      }, 3000);
    };

    poll();
  });
}

export async function createDatabaseIfNotExists(
  client: Client,
  databaseName: string,
) {
  const database = await client.getDatabase(databaseName);

  if (database && database.state === DatabaseState.CREATED) {
    return;
  }

  await client.createDatabase(databaseName);
}
