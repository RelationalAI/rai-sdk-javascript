import { Command } from 'commander';

import { Context, EngineState, listEngines, readConfig } from '../index';

async function run(state?: EngineState, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await listEngines(context, { state });

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .option('-s, --state <type>', 'engine state')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.state, options.profile);
  } catch (error) {
    console.error(error);
  }
})();
