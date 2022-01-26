import fetch from 'cross-fetch';
import { stringify } from 'query-string';

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
    const parsedUrl = new URL(url);

    defaultHeaders['Host'] = parsedUrl.hostname;
    defaultHeaders['User-agent'] = sdkUserAgent;
  }

  return { ...defaultHeaders, ...headers };
}

export function makeUrl(scheme: string, host: string, port: string) {
  scheme = scheme.replace(/[^A-Za-z]/, '');

  return `${scheme}://${host}${port ? ':' + port : ''}`;
}

type InfraError = {
  status: string;
  message: string;
  details?: string;
};

export class SdkError extends Error implements InfraError {
  status: string;
  message: string;
  details?: string;
  response: Response;

  constructor(body: any, response: Response) {
    const err = body as InfraError;

    super(err.message);

    this.name = 'SdkError';
    this.status = err.status;
    this.message = err.message;
    this.details = err.details;
    this.response = response;
  }

  toString() {
    return `${this.response.status} ${this.status}: ${this.message} ${
      this.details || ''
    }`;
  }
}

export async function request<T>(url: string, options: RequestOptions = {}) {
  const opts = {
    method: options.method || 'GET',
    body: JSON.stringify(options.body),
    headers: addDefaultHeaders(options.headers, url),
  };
  const fullUrl =
    options.query && Object.keys(options.query).length > 0
      ? `${url}?${stringify(options.query, { arrayFormat: 'none' })}`
      : url;

  const response = await fetch(fullUrl, opts);
  const contentType = response.headers.get('content-type');
  let responseBody;

  if (contentType && contentType.includes('application/json')) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }

  if (response.ok) {
    return responseBody as T;
  }

  throw new SdkError(responseBody, response);
}
