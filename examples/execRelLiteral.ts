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

import { Client, readConfig, ResultTable } from '../index.node';

async function run(
  database: string,
  engine: string,
  queryString: string,
  readonly: boolean,
  tag: string,
  profile?: string,
) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const tags = tag ? [tag] : undefined;
  const result = await client.exec(
    database,
    engine,
    queryString,
    [],
    readonly,
    tags,
  );

  const literal =
    '{\n' +
    result.results.map(rel => new ResultTable(rel).toRelLiteral()).join(';\n') +
    '\n}';
  console.log(literal);
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .requiredOption('-c, --command <type>', 'rel source string')
    .option('-t, --tag <type>', 'tag', '')
    .option('-r, --readonly', 'readonly', false)
    .option('--poll', 'poll results', false)
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(
      options.database,
      options.engine,
      options.command,
      options.readonly,
      options.tag,
      options.profile,
    );
  } catch (error: any) {
    console.error(error.toString());
  }
})();
