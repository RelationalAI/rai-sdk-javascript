import { Command } from 'commander';

import { Context, enableUser, readConfig } from '../index';

async function run(userId: string, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await enableUser(context, userId);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-i, --id <type>', 'user id')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.id, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
