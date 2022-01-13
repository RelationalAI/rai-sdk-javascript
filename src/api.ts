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

import { Credentials } from './credentials';

export class Context {
  constructor(
    public credentials: Credentials,
    public host: string,
    public port = '443',
    public scheme = 'https',
    public region = 'us-east',
  ) {}

  async request(path: string, method = 'GET') {
    const url = `${this.scheme}://${this.host}:${this.port}${path}`;
    const token = await this.credentials.getToken();
    const headers = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      authorization: `Bearer ${token}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    const response = await fetch(url, options);

    if (response.ok) {
      return await response.json();
    }

    // TODO
    throw response;
  }
}
