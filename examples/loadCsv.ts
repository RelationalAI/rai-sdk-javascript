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

import { Command } from 'commander';
import { promises } from 'fs';
import path from 'path';

import { Client, CsvConfigSyntax, readConfig } from '../index.node';
import { showTransactionResult } from './show';

async function run(
  database: string,
  engine: string,
  filePath: string,
  relation?: string,
  syntax?: CsvConfigSyntax,
  profile?: string,
) {
  const csv = await promises.readFile(filePath, 'utf-8');
  relation = relation || path.parse(filePath).name;

  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.loadCsv(database, engine, relation, csv, syntax);

  showTransactionResult(result);
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .requiredOption('-f, --file <type>', 'csv file')
    .option('-r, --relation <type>', 'relation name (default: file name)')
    .option(
      '--header-row <type>',
      'header row number, 0 for no header (default: 1)',
    )
    .option('--delim <type>', 'field delimiter')
    .option('--escapechar <type>', 'character used to escape quotes')
    .option('--quotechar <type>', 'quoted field character')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  const schema: CsvConfigSyntax = {};

  if (options.headerRow !== undefined) {
    schema.header_row = Number.parseInt(options.headerRow);
  }

  ['delim' as const, 'escapechar' as const, 'quotechar' as const].forEach(
    opt => {
      if (options[opt] !== undefined) {
        schema[opt] = options[opt] as string;
      }
    },
  );

  try {
    await run(
      options.database,
      options.engine,
      options.file,
      options.relation,
      schema,
      options.profile,
    );
  } catch (error: any) {
    console.error(error.toString());
  }
})();
