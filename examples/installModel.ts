import { Command } from 'commander';
import { promises } from 'fs';
import path from 'path';

import { Context, installModels, readConfig } from '../index';

async function run(
  database: string,
  engine: string,
  filePath: string,
  profile?: string,
) {
  const file = await promises.readFile(filePath, 'utf-8');
  const name = path.parse(filePath).name;
  const model = {
    type: 'Source',
    path: name,
    name: name,
    value: file,
  };

  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await installModels(context, database, engine, [model]);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-d, --database <type>', 'database name')
    .requiredOption('-e, --engine <type>', 'engine name')
    .requiredOption('-f, --file <type>', 'model file')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.database, options.engine, options.file, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
