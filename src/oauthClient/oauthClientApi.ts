import { Base } from '../base';
import { CompactOAuthClient, OAuthClient, Permission } from './types';

const ENDPOINT = 'oauth-clients';

type ListReponse = { clients: CompactOAuthClient[] };
type SingleReponse = { client: OAuthClient };
type DeleteResponse = {
  client_id: string;
  message: string;
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
}
