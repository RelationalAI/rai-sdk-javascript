import { Command } from 'commander';

import { Context, listModels, readConfig } from '../index';

async function run(database: string, engine: string, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await listModels(context, database, engine);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.database, options.engine, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
