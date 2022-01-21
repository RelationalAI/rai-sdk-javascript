import { Command } from 'commander';

import { Context, readConfig, rotateOAuthClientSecret } from '../index';

async function run(clientId: string, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await rotateOAuthClientSecret(context, clientId);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-i, --id <type>', 'oauth client id')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.id, options.profile);
  } catch (error) {
    console.error(error);
  }
})();
