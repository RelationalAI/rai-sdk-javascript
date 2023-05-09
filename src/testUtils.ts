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

/* eslint-disable no-console */

import jwtDecode from 'jwt-decode';
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
import { readConfig } from './config';
import { ClientCredentials, GetTokenCredentials } from './credentials';
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

export async function getClient() {
  let config: Config;

  if (
    process.env.CLIENT_ID &&
    process.env.CLIENT_SECRET &&
    process.env.CLIENT_CREDENTIALS_URL
  ) {
    const credentials = new ClientCredentials(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.CLIENT_CREDENTIALS_URL,
    );
    const host = process.env.HOST || 'azure.relationalai.com';

    config = {
      credentials,
      host,
      scheme: 'https',
      port: '443',
    };
  } else {
    config = await readConfig();
  }

  const client = new Client(config);

  client['customHeaders'] = readCustomHeaders();

  logifyClient(client);

  return client;
}

function readCustomHeaders() {
  if (process.env.CUSTOM_HEADERS) {
    try {
      return JSON.parse(process.env.CUSTOM_HEADERS) as Record<string, string>;
    } catch {
      return {};
    }
  }

  return {};
}

export function getEngineName() {
  const engineName = (globalThis as any).__RAI_ENGINE__;

  if (typeof engineName === 'string') {
    return engineName;
  }

  throw new Error('__RAI_ENGINE__ global variable is not set.');
}

export async function createEngineIfNotExists(
  client: Client,
  engineName: string,
  timeout: number = 1000 * 60 * 10,
): Promise<void> {
  const checkEngine = async () => {
    const engines = await client.listEngines({
      name: engineName,
      state: EngineState.PROVISIONED,
    });
    const engine = engines.find(e => e.state === EngineState.PROVISIONED);

    return !!engine;
  };

  console.log(`Checking if ${engineName} engine exists`);

  if (await checkEngine()) {
    console.log(`${engineName} engine exists`);
    return;
  }

  console.log(`Creating ${engineName} engine`);
  await client.createEngine(engineName);

  const startedAt = Date.now();

  console.log(`Waiting until ${engineName} gets provisioned`);

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
  const databases = await client.listDatabases({
    name: databaseName,
    state: DatabaseState.CREATED,
  });
  const database = databases.find(d => d.state === DatabaseState.CREATED);

  if (database) {
    return;
  }

  await client.createDatabase(databaseName);
}

export async function printEnvInfo(client: Client) {
  const token = await client.config.credentials.getToken(client.baseUrl);
  const decodedToken: any = jwtDecode(token);

  console.log(`Env: ${decodedToken['aud']}`);
  console.log(
    `Account: ${decodedToken['https://relational.ai/claims/account']}`,
  );
}

function logifyClient(client: Client) {
  const execAsync = client.execAsync.bind(client);

  client.execAsync = async (...args) => {
    testLog(`execAsync database: ${args[0]} engine: ${args[1]}`);

    const result = await execAsync(...args);

    testLog(
      `transaction: ${result.transaction.id} ${result.transaction.state}`,
    );

    return result;
  };

  const pollTransaction = client.pollTransaction.bind(client);
  const timeout = (globalThis as any).__RAI_TIMEOUT__;

  client.pollTransaction = async (...args) => {
    testLog(`polling transaction ${args[0]}`);

    return await pollTransaction(args[0], {
      timeout: timeout ? Number(timeout) : 120000,
    });
  };
}

function testLog(msg: string) {
  // defined in jest.reporter in order to catch logs per test
  const log = (globalThis as any).testLog;

  if (typeof log === 'function') {
    log(msg);
  }
}
