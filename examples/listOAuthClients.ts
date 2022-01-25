import { Command } from 'commander';

import { Context, listOAuthClients, readConfig } from '../index';

async function run(profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await listOAuthClients(context);

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
