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

import { PollOptions, pollWithOverhead } from '../../rest';
import { TransactionAsyncApi } from '../transaction/transactionAsyncApi';
import {
  isTransactionDone,
  makeArrowRelations,
} from '../transaction/transactionUtils';
import {
  TransactionAsync,
  TransactionAsyncPayload,
  TransactionAsyncResult,
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

    return await this.runTransactionAsync(transaction);
  }

  async exec(
    database: string,
    engine: string,
    queryString: string,
    inputs: QueryInput[] = [],
    readonly = true,
    tags: string[] = [],
    timeout = Number.POSITIVE_INFINITY,
  ) {
    const startTime = Date.now();
    const result = await this.execAsync(
      database,
      engine,
      queryString,
      inputs,
      readonly,
      tags,
    );
    const txnId = result.transaction.id;

    if ('results' in result) {
      return result;
    }

    return await this.pollTransaction(txnId, { timeout, startTime });
  }

  async pollTransaction(
    txnId: string,
    options?: PollOptions,
  ): Promise<TransactionAsyncResult> {
    const transaction = await pollWithOverhead<TransactionAsync>(async () => {
      try {
        const transaction = await this.getTransaction(txnId);
        return {
          done: transaction && isTransactionDone(transaction.state),
          result: transaction,
        };
        // eslint-disable-next-line no-empty
      } catch {}

      return {
        done: false,
      };
    }, options);

    const data = await Promise.all([
      this.getTransactionMetadata(txnId),
      this.getTransactionProblems(txnId),
      this.getTransactionResults(txnId),
    ]);

    return {
      transaction,
      problems: data[1],
      results: makeArrowRelations(data[2], data[0]),
    };
  }

  async loadJson(
    database: string,
    engine: string,
    relation: string,
    json: any,
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

    return this.exec(database, engine, qs.join('\n'), inputs, false);
  }

  async loadCsv(
    database: string,
    engine: string,
    relation: string,
    csv: string,
    syntax?: CsvConfigSyntax,
    schema?: CsvConfigSchema,
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

    return this.exec(database, engine, qs.join('\n'), inputs, false);
  }
}
