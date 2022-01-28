export type OAuthClient = {
  id: string;
  name: string;
  secret: string;
  created_on: string;
  created_by: string;
  permissions: Permission[];
};

export type CompactOAuthClient = Pick<
  OAuthClient,
  'id' | 'name' | 'created_by' | 'created_on'
>;

export enum Permission {
  // engines
  CREATE_COMPUTE = 'create:compute',
  DELETE_COMPUTE = 'delete:compute',
  LIST_COMPUTES = 'list:compute',
  READ_COMPUTE = 'read:compute',
  // databases
  LIST_DATABASES = 'list:database',
  UPDATE_DATABASE = 'update:database',
  DELETE_DATABASE = 'delete:database',
  // transactions
  RUN_TRANSACTION = 'run:transaction',
  // credits
  READ_CREDITS_USAGE = 'read:credits_usage',
  // oauth clients
  CREATE_OAUTH_CLIENT = 'create:oauth_client',
  READ_OAUTH_CLIENT = 'read:oauth_client',
  LIST_OAUTH_CLIENTS = 'list:oauth_client',
  UPDATE_OAUTH_CLIENT = 'update:oauth_client',
  DELETE_OAUTH_CLIENT = 'delete:oauth_client',
  ROTATE_OAUTH_CLIENT_SECRET = 'rotate:oauth_client_secret',
  // users
  CREATE_USER = 'create:user',
  LIST_USERS = 'list:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  // roles
  LIST_ROLES = 'list:role',
  READ_ROLE = 'read:role',
  // permissions
  LIST_PERMISSIONS = 'list:permission',
  // access keys
  CREATE_ACCESS_KEY = 'create:accesskey',
  LIST_ACCESS_KEYS = 'list:accesskey',
}
