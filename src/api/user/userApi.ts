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

import { Base, BaseOptions } from '../base';
import { User, UserRole, UserStatus } from './types';

const ENDPOINT = 'users';

type ListReponse = { users: User[] };
type SingleReponse = { user: User };
type DeleteResponse = {
  user_id: string;
  message: string;
};

export class UserApi extends Base {
  async createUser(
    email: string,
    roles: UserRole[],
    { signal }: BaseOptions = {},
  ) {
    const result = await this.post<SingleReponse>(ENDPOINT, {
      body: {
        email,
        roles,
      },
      signal,
    });

    return result.user;
  }

  async listUsers({ signal }: BaseOptions = {}) {
    const result = await this.get<ListReponse>(ENDPOINT, { signal });

    return result.users;
  }

  async getUser(userId: string, { signal }: BaseOptions = {}) {
    const result = await this.get<SingleReponse>(`${ENDPOINT}/${userId}`, {
      signal,
    });

    return result.user;
  }

  async updateUser(
    userId: string,
    status?: UserStatus,
    roles?: UserRole[],
    { signal }: BaseOptions = {},
  ) {
    const body: any = {};

    if (status) {
      body.status = status;
    }

    if (roles && roles.length) {
      body.roles = roles;
    }

    const result = await this.patch<SingleReponse>(`${ENDPOINT}/${userId}`, {
      body,
      signal,
    });

    return result.user;
  }

  async enableUser(userId: string, { signal }: BaseOptions = {}) {
    return await this.updateUser(userId, UserStatus.ACTIVE, [], { signal });
  }

  async disableUser(userId: string, { signal }: BaseOptions = {}) {
    return await this.updateUser(userId, UserStatus.INACTIVE, [], { signal });
  }

  async deleteUser(userId: string, { signal }: BaseOptions = {}) {
    const result = await this.delete<DeleteResponse>(`${ENDPOINT}/${userId}`, {
      signal,
    });

    return result;
  }
}
