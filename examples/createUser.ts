import { Command } from 'commander';

import { Client, readConfig, UserRole } from '../index';

async function run(email: string, role: UserRole, profile?: string) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.createUser(email, [role]);

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-e, --email <type>', 'user email')
    .option('-r, --role <type>', 'user role', UserRole.USER)
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.email, options.role, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
