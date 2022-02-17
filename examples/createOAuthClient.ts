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

import { Client, Permission, readConfig } from '../index.node';

async function run(name: string, permissions: Permission[], profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.createOAuthClient(
    name,
    permissions.length > 0 ? permissions : undefined,
  );

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-n, --name <type>', 'oauth client name')
    .option(
      '--permissions <value>',
      'oauth client permissions. By default it will be ' +
        'assigned the same permissions as the creating entity ' +
        `(user or OAuth client). Available: ${Object.values(Permission).join(
          ', ',
        )}`,
      function collect(value: string, previous: string[]) {
        return previous.concat([value]);
      },
      [],
    )
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.name, options.permissions, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
