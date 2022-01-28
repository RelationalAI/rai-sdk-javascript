import { Command } from 'commander';

import { Client, EngineSize, readConfig } from '../index';

async function run(name: string, size: EngineSize, profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.createEngine(name, size);

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
  } catch (error: any) {
    console.error(error.toString());
  }
})();
