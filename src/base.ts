import { makeUrl, request, RequestOptions } from './rest';
import { Config } from './types';

type OnResponse = RequestOptions['onResponse'];

export abstract class Base {
  baseUrl: string;

  private _onResponse?: OnResponse;

  constructor(public config: Config, public region = 'us-east') {
    // TODO impove to accept baseUrl, useful in the Console
    this.baseUrl = makeUrl(config.scheme, config.host, config.port);
  }

  // TODO maybe something like client.on('response', handler) instead?
  onResponse(onResponse: OnResponse) {
    this._onResponse = onResponse;
  }

  protected async request<T>(
    path: string,
    options: Omit<RequestOptions, 'body'> = {},
  ) {
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

  protected async get<T>(path: string, query: RequestOptions['query'] = {}) {
    return this.request<T>(path, { query, method: 'GET' });
  }

  protected async post<T>(
    path: string,
    options: Pick<RequestOptions, 'query' | 'body'>,
  ) {
    return this.request<T>(path, { method: 'POST', ...options });
  }

  protected async put<T>(
    path: string,
    options: Pick<RequestOptions, 'query' | 'body'>,
  ) {
    return this.request<T>(path, { method: 'PUT', ...options });
  }

  protected async patch<T>(
    path: string,
    options: Pick<RequestOptions, 'query' | 'body'>,
  ) {
    return this.request<T>(path, { method: 'PATCH', ...options });
  }

  protected async delete<T>(
    path: string,
    options: Pick<RequestOptions, 'query' | 'body'>,
  ) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}
