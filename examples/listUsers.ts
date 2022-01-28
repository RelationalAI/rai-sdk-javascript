import { Command } from 'commander';

import { Client, readConfig } from '../index';

async function run(profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.listUsers();

  console.log(JSON.stringify(result, undefined, 2));
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
