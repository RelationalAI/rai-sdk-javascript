import fetch from 'cross-fetch';
import urlParse from 'url-parse';

import { VERSION } from './types';

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, any>;
};

function addDefaultHeaders(headers: RequestInit['headers'], url: string) {
  const sdkUserAgent = `rai-sdk-javascript/${VERSION}`;
  const defaultHeaders: RequestInit['headers'] = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    'X-User-agent': sdkUserAgent,
  };

  if (isNode) {
    // Only in Node because Browsers won't allow to set
    defaultHeaders['Host'] = urlParse(url).host;
    defaultHeaders['User-agent'] = sdkUserAgent;
  }

  return { ...defaultHeaders, ...headers };
}

export async function request<T>(url: string, options: RequestOptions = {}) {
  const opts = {
    method: options.method || 'GET',
    body: JSON.stringify(options.body),
    headers: addDefaultHeaders(options.headers, url),
  };
  const fullUrl = options.query
    ? `${url}?${urlParse.qs.stringify(options.query)}`
    : url;

  const response = await fetch(fullUrl, opts);

  if (response.ok) {
    const responseBody = await response.json();

    return responseBody as T;
  }

  // TODO figure out how to handle it better
  throw {
    statusCode: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}
