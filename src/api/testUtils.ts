import nock from 'nock';

import { GetTokenCredentials } from '../credentials';
import { mkUrl } from '../rest';
import { Context } from './context';
import {
  LabeledAction,
  LabeledActionResult,
  Transaction,
  TransactionMode,
  TransactionResult,
} from './transaction';

export const host = 'example.com';
export const scheme = 'https';
export const port = '443';
export const baseUrl = mkUrl(scheme, host, port);

export function getMockContext() {
  const credentials = new GetTokenCredentials(() =>
    Promise.resolve('mock token'),
  );
  const context = new Context({
    host,
    port,
    scheme,
    credentials,
  });

  return context;
}

export function mkTransactionRequest(
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

export function mkTransactionResult(
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
  const request = mkTransactionRequest(actions, database, engine, readonly);
  const response = mkTransactionResult(actionResults);
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
