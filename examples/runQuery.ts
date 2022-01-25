import { Command } from 'commander';

import { Context, query, readConfig } from '../index';

async function run(
  database: string,
  engine: string,
  queryString: string,
  profile?: string,
) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await query(context, database, engine, queryString);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .requiredOption('-c, --command <type>', 'rel source string')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(
      options.database,
      options.engine,
      options.command,
      options.profile,
    );
  } catch (error: any) {
    console.error(error.toString());
  }
})();
