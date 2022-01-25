import { Command } from 'commander';

import { Context, listUsers, readConfig } from '../index';

async function run(profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await listUsers(context);

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
  } catch (error) {
    console.error(error);
  }
})();
