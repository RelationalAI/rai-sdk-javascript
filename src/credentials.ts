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

import urlParse from 'url-parse';

import { request } from './rest';

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
  createdOn: number;

  constructor(public token: string, public experiesIn: number) {
    this.createdOn = Date.now();
  }

  get isExpired() {
    return Date.now() - this.createdOn >= this.experiesIn;
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

export class ClientCredentials extends Credentials {
  clientId: string;
  clientSecret: string;
  clientCredentialsUrl: string;
  accessToken?: AccessToken;

  constructor(
    clientId: string,
    clientSecret: string,
    clientCredentialsUrl: string,
  ) {
    super();

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.clientCredentialsUrl = clientCredentialsUrl;
  }

  async getToken(requestedUrl: string) {
    if (this.accessToken && !this.accessToken.isExpired) {
      return this.accessToken.token;
    }

    return this.requestToken(requestedUrl);
  }

  private async requestToken(requestedUrl: string) {
    const body: TokenRequest = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      // ensure the audience contains the protocol scheme
      audience: `https://${urlParse(requestedUrl).host}`,
    };

    const data = await request<TokenResponse>(this.clientCredentialsUrl, {
      method: 'POST',
      body,
    });

    this.accessToken = new AccessToken(data.access_token, data.expires_in);

    return this.accessToken.token;
  }
}
