import { Command } from 'commander';

import { Client, DatabaseState, readConfig } from '../index';

async function run(state?: DatabaseState, profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.listDatabases({ state });

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .option('-s, --state <type>', 'database state')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.state, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
