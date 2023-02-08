/**
 * Copyright 2021 RelationalAI, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

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
  CREATE_DATABASE = 'create:database',
  LIST_DATABASES = 'list:database',
  UPDATE_DATABASE = 'update:database',
  DELETE_DATABASE = 'delete:database',
  // transactions
  RUN_TRANSACTION = 'run:transaction',
  RUN_READ_ONLY_TRANSACTION = 'run-read:transaction',
  LIST_TRANSACTION = 'list:transaction',
  DELETE_TRANSACTION = 'delete:transaction',
  READ_TRANSACTION = 'read:transaction',
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
  DELETE_USER = 'delete:user',
  // roles
  LIST_ROLES = 'list:role',
  READ_ROLE = 'read:role',
  // permissions
  LIST_PERMISSIONS = 'list:permission',
  // access keys
  CREATE_ACCESS_KEY = 'create:accesskey',
  LIST_ACCESS_KEYS = 'list:accesskey',
}

export type PermissionDescription = {
  name: Permission;
  description: string;
};
