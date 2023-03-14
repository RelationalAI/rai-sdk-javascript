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
import {
  CompactOAuthClient,
  OAuthClient,
  Permission,
  PermissionDescription,
} from './types';

const ENDPOINT = 'oauth-clients';

type ListReponse = { clients: CompactOAuthClient[] };
type SingleReponse = { client: OAuthClient };
type DeleteResponse = {
  client_id: string;
  message: string;
};
type ListPermissionResponse = {
  permissions: PermissionDescription[];
};

export class OAuthClientApi extends Base {
  async createOAuthClient(
    name: string,
    permissions?: Permission[],
    { signal }: BaseOptions = {},
  ) {
    const result = await this.post<SingleReponse>(ENDPOINT, {
      body: {
        name,
        permissions,
      },
      signal,
    });

    return result.client;
  }

  async listOAuthClients({ signal }: BaseOptions = {}) {
    const result = await this.get<ListReponse>(ENDPOINT, { signal });

    return result.clients;
  }

  async getOAuthClient(clientId: string, { signal }: BaseOptions = {}) {
    const result = await this.get<SingleReponse>(`${ENDPOINT}/${clientId}`, {
      signal,
    });

    return result.client;
  }

  async updateOAuthClient(
    clientId: string,
    name?: string,
    permissions?: Permission[],
    { signal }: BaseOptions = {},
  ) {
    const body: any = {};

    if (name) {
      body.name = name;
    }

    if (permissions) {
      body.permissions = permissions;
    }

    const result = await this.patch<SingleReponse>(`${ENDPOINT}/${clientId}`, {
      body,
      signal,
    });

    return result.client;
  }

  async rotateOAuthClientSecret(
    clientId: string,
    { signal }: BaseOptions = {},
  ) {
    const result = await this.post<SingleReponse>(
      `${ENDPOINT}/${clientId}/rotate-secret`,
      { signal },
    );

    return result.client;
  }

  async deleteOAuthClient(clientId: string, { signal }: BaseOptions = {}) {
    const result = await this.delete<DeleteResponse>(
      `${ENDPOINT}/${clientId}`,
      { signal },
    );

    return result;
  }

  async listPermissions({ signal }: BaseOptions = {}) {
    const result = await this.get<ListPermissionResponse>('permissions', {
      signal,
    });

    return result.permissions;
  }
}
