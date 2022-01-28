import { Command } from 'commander';

import { Client, readConfig, UserRole, UserStatus } from '../index';

async function run(
  userId: string,
  status?: UserStatus,
  role?: UserRole,
  profile?: string,
) {
  const config = await readConfig(profile);
  const client = new Client(config);
  const result = await client.updateUser(
    userId,
    status,
    role ? [role] : undefined,
  );

  console.log(JSON.stringify(result, undefined, 2));
}

(async () => {
  const program = new Command();

  const options = program
    .requiredOption('-i, --id <type>', 'user id')
    .option('-s, --status <type>', 'user status')
    .option('-r, --role <type>', 'user role')
    .option('-p, --profile <type>', 'profile', 'default')
    .parse(process.argv)
    .opts();

  try {
    await run(options.id, options.status, options.role, options.profile);
  } catch (error: any) {
    console.error(error.toString());
  }
})();
