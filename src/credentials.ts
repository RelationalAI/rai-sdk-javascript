import { request } from './rest';
import { AccessTokenCache } from './types';

export abstract class Credentials {
  abstract getToken(url: string): Promise<string>;
}

type GetToken = (url: string) => Promise<string>;

export class GetTokenCredentials extends Credentials {
  getToken: GetToken;

  constructor(getToken: GetToken) {
    super();

    this.getToken = getToken;
  }
}

class AccessToken {
  constructor(
    public token: string,
    public experiesIn: number,
    public createdOn: number,
  ) {}

  get isExpired() {
    const delta = Date.now() - this.createdOn;

    // experiesIn stored in seconds
    return delta / 1000 >= this.experiesIn;
  }
}

type TokenRequest = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  audience: string;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

type ReadCacheFn = () => Promise<AccessTokenCache | undefined>;
type WriteCacheFn = (c: AccessTokenCache) => Promise<void>;

export class ClientCredentials extends Credentials {
  clientId: string;
  clientSecret: string;
  clientCredentialsUrl: string;
  accessToken?: AccessToken;

  constructor(
    clientId: string,
    clientSecret: string,
    clientCredentialsUrl: string,
    private readCache?: ReadCacheFn,
    private writeCache?: WriteCacheFn,
  ) {
    super();

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.clientCredentialsUrl = clientCredentialsUrl;
  }

  async getToken(requestedUrl: string) {
    await this.readTokenFromCache();

    if (this.accessToken && !this.accessToken.isExpired) {
      return this.accessToken.token;
    }

    return this.requestToken(requestedUrl);
  }

  private async readTokenFromCache() {
    if (!this.accessToken && this.readCache) {
      const cache = await this.readCache();

      if (cache) {
        this.accessToken = new AccessToken(
          cache.access_token,
          cache.expires_in,
          cache.created_on,
        );
      }
    }
  }

  private async requestToken(requestedUrl: string) {
    const parsedUrl = new URL(requestedUrl);
    const body: TokenRequest = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      // ensure the audience contains the protocol scheme
      audience: `https://${parsedUrl.hostname}`,
    };

    const data = await request<TokenResponse>(this.clientCredentialsUrl, {
      method: 'POST',
      body,
    });

    const token: AccessTokenCache = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      created_on: Date.now(),
    };

    this.accessToken = new AccessToken(
      token.access_token,
      token.expires_in,
      token.created_on,
    );

    if (this.writeCache) {
      await this.writeCache(token);
    }

    return this.accessToken.token;
  }
}
