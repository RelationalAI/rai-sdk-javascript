import { Command } from 'commander';

import { Client, Permission, readConfig } from '../index';

async function run(name: string, permissions: Permission[], profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.createOAuthClient(
    name,
    permissions.length > 0 ? permissions : undefined,
  );

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-n, --name <type>', 'oauth client name')
    .option(
      '--permissions <value>',
      'oauth client permissions. By default it will be ' +
        'assigned the same permissions as the creating entity ' +
        `(user or OAuth client). Available: ${Object.values(Permission).join(
          ', ',
        )}`,
      function collect(value: string, previous: string[]) {
        return previous.concat([value]);
      },
      [],
    )
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.name, options.permissions, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
