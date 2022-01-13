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

// TODO consider dropping this
export abstract class Credentials {}

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

export const DEFAULT_CLIENT_CREDENTIALS_URL =
  'https://login.relationalai.com/oauth/token';

export class ClientCredentials extends Credentials {
  clientId: string;
  clientSecret: string;
  clientCredentialsUrl: string;
  accessToken?: AccessToken;

  constructor(
    clientId: string,
    clientSecret: string,
    clientCredentialsUrl = DEFAULT_CLIENT_CREDENTIALS_URL,
  ) {
    super();

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.clientCredentialsUrl = clientCredentialsUrl;
  }
}
