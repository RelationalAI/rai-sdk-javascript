import { Command } from 'commander';

import { Context, deleteDatabase, readConfig } from '../index';

async function run(name: string, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await deleteDatabase(context, name);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .option('-n, --name <type>', 'database name')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.name, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
