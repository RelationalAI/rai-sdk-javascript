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

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { BaseOptions } from '../base';
import { TransactionAsyncApi } from '../transaction/transactionAsyncApi';
import {
  isTransactionDone,
  makeArrowRelations,
} from '../transaction/transactionUtils';
import {
  TransactionAsyncCompact,
  TransactionAsyncPayload,
  TransactionPollOptions,
} from '../transaction/types';
import { CsvConfigSchema, CsvConfigSyntax, QueryInput } from './types';
import { makeQueryInput, schemaToRel, syntaxToRel } from './utils';

export class ExecAsyncApi extends TransactionAsyncApi {
  async execAsync(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
    tags: string[] = [],
    { signal }: BaseOptions = {},
  ) {
    const transaction: TransactionAsyncPayload = {
      dbname: database,
      query: queryString,
      nowait_durable: false,
      readonly,
      v1_inputs: inputs.map(input => makeQueryInput(input.name, input.value)),
      tags,
    };

    if (engine) {
      transaction.engine_name = engine;
    }

    return await this.runTransactionAsync(transaction, { signal });
  }

  async exec(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
    tags: string[] = [],
    { interval, timeout, signal }: TransactionPollOptions = {},
  ) {
    const result = await this.execAsync(
      database,
      engine,
      queryString,
      inputs,
      readonly,
      tags,
      { signal },
    );
    const txnId = result.transaction.id;

    if ('results' in result) {
      return result;
    }

    return await this.pollTransaction(txnId, {
      interval: interval ?? 1000,
      timeout: timeout ?? Number.POSITIVE_INFINITY,
      signal,
    });
  }

  async pollTransaction(txnId: string, options: TransactionPollOptions = {}) {
    const timeout = options.timeout ?? Number.POSITIVE_INFINITY;
    const interval = options.interval ?? 1000;
    const signal = options.signal;
    const startedAt = Date.now();

    let transaction: TransactionAsyncCompact | undefined;

    return new Promise<void>((resolve, reject) => {
      const checkState = () => {
        setTimeout(async () => {
          try {
            transaction = await this.getTransaction(txnId, { signal });
            // eslint-disable-next-line no-empty
          } catch {}

          if (transaction && isTransactionDone(transaction.state)) {
            resolve();
          } else {
            if (Date.now() - startedAt > timeout) {
              reject(
                new Error(
                  `Polling transaction timeout of ${timeout}ms has been exceeded.`,
                ),
              );
            }

            checkState();
          }
        }, interval);
      };

      checkState();
    })
      .then(() =>
        Promise.all([
          this.getTransactionMetadata(txnId, { signal }),
          this.getTransactionProblems(txnId, { signal }),
          this.getTransactionResults(txnId, { signal }),
        ]),
      )
      .then(async data => ({
        results: await makeArrowRelations(data[2], data[0]),
        problems: data[1],
      }))
      .then(({ results, problems }) => ({
        transaction: transaction!,
        problems,
        results,
      }));
  }

  async loadJson(
    database: string,
    engine: string,
    relation: string,
    json: any,
    { signal }: BaseOptions = {},
  ) {
    const qs = [
      `def config:data = data`,
      `def insert:${relation} = load_json[config]`,
    ];
    const inputs: QueryInput[] = [
      {
        name: 'data',
        value: JSON.stringify(json),
      },
    ];

    return this.exec(database, engine, qs.join('\n'), inputs, false, [], {
      signal,
    });
  }

  async loadCsv(
    database: string,
    engine: string,
    relation: string,
    csv: string,
    syntax?: CsvConfigSyntax,
    schema?: CsvConfigSchema,
    { signal }: BaseOptions = {},
  ) {
    const qs = [`def config:data = data`];
    const inputs: QueryInput[] = [
      {
        name: 'data',
        value: csv,
      },
    ];

    if (syntax) {
      qs.push(...syntaxToRel(syntax));
    }

    if (schema) {
      qs.push(...schemaToRel(schema));
    }

    qs.push(`def insert:${relation} = load_csv[config]`);

    return this.exec(database, engine, qs.join('\n'), inputs, false, [], {
      signal,
    });
  }
}
