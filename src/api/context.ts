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

import { makeUrl, request, RequestOptions } from '../rest';
import { Config } from '../types';

type OnResponse = RequestOptions['onResponse'];

export class Context {
  baseUrl: string;

  private _onResponse?: OnResponse;

  constructor(public config: Config, public region = 'us-east') {
    // TODO impove to accept baseUrl, useful in the Console
    this.baseUrl = makeUrl(config.scheme, config.host, config.port);
  }

  onResponse(onResponse: OnResponse) {
    this._onResponse = onResponse;
  }

  async request<T>(path: string, options: Omit<RequestOptions, 'body'> = {}) {
    const url = `${this.baseUrl}/${path}`;
    const token = await this.config.credentials.getToken(url);
    const opts: RequestOptions = {
      ...options,

      onResponse: this._onResponse,
    };

    if (token) {
      opts.headers = {
        authorization: `Bearer ${token}`,
      };
    }

    return await request<T>(url, opts);
  }

  async get<T>(path: string, query: RequestOptions['query'] = {}) {
    return this.request<T>(path, { query, method: 'GET' });
  }

  async post<T>(path: string, options: Pick<RequestOptions, 'query' | 'body'>) {
    return this.request<T>(path, { method: 'POST', ...options });
  }

  async put<T>(path: string, options: Pick<RequestOptions, 'query' | 'body'>) {
    return this.request<T>(path, { method: 'PUT', ...options });
  }

  async patch<T>(
    path: string,
    options: Pick<RequestOptions, 'query' | 'body'>,
  ) {
    return this.request<T>(path, { method: 'PATCH', ...options });
  }

  async delete<T>(
    path: string,
    options: Pick<RequestOptions, 'query' | 'body'>,
  ) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}
