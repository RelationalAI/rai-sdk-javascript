import { Command } from 'commander';
import { promises } from 'fs';
import path from 'path';

import { Context, loadJson, readConfig } from '../index';

async function run(
  database: string,
  engine: string,
  filePath: string,
  relation?: string,
  profile?: string,
) {
  const file = await promises.readFile(filePath, 'utf-8');
  const json = JSON.parse(file);
  relation = relation || path.parse(filePath).name;

  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await loadJson(context, database, engine, relation, json);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .requiredOption('-f, --file <type>', 'json file')
    .option('-r, --relation <type>', 'relation name (default: file name)')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(
      options.database,
      options.engine,
      options.file,
      options.relation,
      options.profile,
    );
  } catch (error: any) {
    console.error(error.toString());
  }
})();
