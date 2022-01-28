import { Command } from 'commander';

import { Client, readConfig } from '../index';

async function run(name: string, profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.getEngine(name);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .option('-n, --name <type>', 'engine name')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.name, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
