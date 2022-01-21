import { Command } from 'commander';

import { Context, createDatabase, readConfig } from '../index';

async function run(name: string, clone?: string, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await createDatabase(context, name, clone);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-n, --name <type>', 'database name')
    .option('-c, --clone <type>', 'database name to clone')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.name, options.profile);
  } catch (error) {
    console.error(error);
  }
})();
