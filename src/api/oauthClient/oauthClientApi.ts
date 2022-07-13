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

import { Base } from '../base';
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
  async createOAuthClient(name: string, permissions?: Permission[]) {
    const result = await this.post<SingleReponse>(ENDPOINT, {
      body: {
        name,
        permissions,
      },
    });

    return result.client;
  }

  async listOAuthClients() {
    const result = await this.get<ListReponse>(ENDPOINT);

    return result.clients;
  }

  async getOAuthClient(clientId: string) {
    const result = await this.get<SingleReponse>(`${ENDPOINT}/${clientId}`);

    return result.client;
  }

  async updateOAuthClient(
    clientId: string,
    name?: string,
    permissions?: Permission[],
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
    });

    return result.client;
  }

  async rotateOAuthClientSecret(clientId: string) {
    const result = await this.post<SingleReponse>(
      `${ENDPOINT}/${clientId}/rotate-secret`,
      {},
    );

    return result.client;
  }

  async deleteOAuthClient(clientId: string) {
    const result = await this.delete<DeleteResponse>(
      `${ENDPOINT}/${clientId}`,
      {},
    );

    return result;
  }

  async listPermissions() {
    const result = await this.get<ListPermissionResponse>('permissions', {});

    return result.permissions;
  }
}
