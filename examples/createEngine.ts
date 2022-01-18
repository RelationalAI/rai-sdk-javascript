import { Command } from 'commander';

import { Context, createEngine, EngineSize, readConfig } from '../index';

async function run(name: string, size: EngineSize, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await createEngine(context, name, size);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-n, --name <type>', 'engine name')
    .option('-s, --size <type>', 'engine size', EngineSize.XS)
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.name, options.size, options.profile);
  } catch (error) {
    console.error(error);
  }
})();
