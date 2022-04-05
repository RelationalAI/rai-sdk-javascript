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

import { Client, readConfig } from '../index.node';
import { show } from './show';

async function run(profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.listOAuthClients();

  show(result);
}

(async () => {
  const program = new Command();

  const options = program
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
