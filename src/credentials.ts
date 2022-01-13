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

import fetch from 'isomorphic-unfetch';

import { Config } from './types';

// TODO consider dropping this
export abstract class Credentials {
  abstract getToken(): Promise<string>;
}

type GetToken = () => Promise<string>;

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

type ClientCredentialsConfig = Pick<
  Config,
  'host' | 'clientId' | 'clientSecret' | 'clientCredentialsUrl'
>;

export class ClientCredentials extends Credentials {
  config: ClientCredentialsConfig;
  accessToken?: AccessToken;

  constructor(config: ClientCredentialsConfig) {
    super();

    this.config = config;
  }

  async getToken() {
    if (this.accessToken && !this.accessToken.isExpired) {
      return this.accessToken.token;
    }

    return this.requestToken();
  }

  private async requestToken() {
    const url = this.config.clientCredentialsUrl;
    const headers = {
      Accept: 'application/json',
      'Content-type': 'application/json',
    };

    const body = JSON.stringify({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials',
      // ensure the audience contains the protocol scheme
      audience: `https://${this.config.host}`,
    });

    const options: RequestInit = {
      method: 'POST',
      headers,
      body,
    };
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      this.accessToken = new AccessToken(data.access_token, data.expires_in);

      return this.accessToken.token;
    }

    throw new Error(
      `getToken failed: ${response.status} ${response.statusText}`,
    );
  }
}
