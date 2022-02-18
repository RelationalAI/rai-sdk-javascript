/**
 * Copyright 2021 RelationalAI, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import fetch from 'cross-fetch';
import { stringify } from 'query-string';

import { TransactionResult } from './transaction/types';
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
  onResponse?: (r: Response) => void;
};

function addDefaultHeaders(headers: RequestInit['headers'], url: string) {
  const sdkUserAgent = `rai-sdk-javascript/${VERSION}`;
  const defaultHeaders: RequestInit['headers'] = {
    Accept: 'application/json',
    'Content-type': 'application/json',
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

  const responseClone = response.clone();

  if (contentType && contentType.includes('application/json')) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }

  if (options.onResponse) {
    try {
      options.onResponse(responseClone.clone());
      // eslint-disable-next-line no-empty
    } catch {}
  }

  if (response.ok) {
    return responseBody as T;
  }

  throw makeError(responseBody, responseClone.clone());
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status = '',
    public details = '',
    public response: Response,
  ) {
    super(message);

    this.name = 'ApiError';
  }

  toString() {
    return `${this.status}: ${this.message}\n${this.details}`;
  }
}

export class TransactionError extends Error {
  message: string;
  result: TransactionResult;
  response: Response;

  constructor(result: TransactionResult, response: Response) {
    const msg = 'Transaction error. See transaction result';

    super(msg);

    this.name = 'TransactionError';
    this.message = msg;
    this.response = response;
    this.result = result;
  }

  toString() {
    return `${this.message}:\n ${JSON.stringify(this.result, undefined, 2)}`;
  }
}

function makeError(body: any, response: Response) {
  if (body?.type === 'TransactionResult') {
    return new TransactionError(body, response);
  }

  if (body?.message) {
    return new ApiError(body.message, body.status, body.details, response);
  }

  return new Error(response.statusText);
}
