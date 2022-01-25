import { Command } from 'commander';

import { Context, createUser, readConfig, UserRole } from '../index';

async function run(email: string, role: UserRole, profile?: string) {
  const config = await readConfig(profile);
  const context = new Context(config);
  const result = await createUser(context, email, [role]);

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
