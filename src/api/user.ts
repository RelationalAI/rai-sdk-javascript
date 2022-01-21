// Copyright 2022 RelationalAI, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Context } from './context';

export type User = {
  id: string;
  email: string;
  roles: UserRole[];
  id_providers: string[];
  status: UserStatus | '';
};

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
const ENDPOINT = 'users';

type ListReponse = { users: User[] };
type SingleReponse = { user: User };
type DeleteResponse = {
  user_id: string;
  message: string;
};

export async function createUser(
  context: Context,
  email: string,
  roles: UserRole[],
) {
  const result = await context.post<SingleReponse>(ENDPOINT, {
    body: {
      email,
      roles,
    },
  });

  return result.user;
}

export async function listUsers(context: Context) {
  const result = await context.get<ListReponse>(ENDPOINT);

  return result.users;
}

export async function getUser(context: Context, userId: string) {
  const result = await context.get<SingleReponse>(`${ENDPOINT}/${userId}`);

  return result.user;
}

export async function updateUser(
  context: Context,
  userId: string,
  status?: UserStatus,
  roles?: UserRole[],
) {
  const body: any = {};

  if (status) {
    body.status = status;
  }

  if (roles && roles.length) {
    body.roles = roles;
  }

  const result = await context.patch<SingleReponse>(`${ENDPOINT}/${userId}`, {
    body,
  });

  return result.user;
}

export async function enableUser(context: Context, userId: string) {
  return await updateUser(context, userId, UserStatus.ACTIVE);
}

export async function disableUser(context: Context, userId: string) {
  return await updateUser(context, userId, UserStatus.INACTIVE);
}

export async function deleteUser(context: Context, userId: string) {
  const result = await context.delete<DeleteResponse>(
    `${ENDPOINT}/${userId}`,
    {},
  );

  return result;
}
