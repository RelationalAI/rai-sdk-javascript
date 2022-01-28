import { Command } from 'commander';

import { Client, readConfig } from '../index';

async function run(
  database: string,
  engine: string,
  name: string,
  profile?: string,
) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.getModel(database, engine, name);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .requiredOption('-n, --name <type>', 'model name')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.database, options.engine, options.name, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
