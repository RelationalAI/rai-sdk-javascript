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

import nodeFetch from 'node-fetch';
import { stringify } from 'query-string';

import { makeError } from './errors';
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

  if (typeof window === 'undefined') {
    // See: https://github.com/node-fetch/node-fetch#custom-highwatermark
    (opts as any).highWaterMark = 1024 * 1024;
  }

  const fullUrl =
    options.query && Object.keys(options.query).length > 0
      ? `${url}?${stringify(options.query, { arrayFormat: 'none' })}`
      : url;

  const fetch = globalThis.fetch || nodeFetch;

  let response: Response;

  try {
    response = await fetch(fullUrl, opts);
  } catch (error: any) {
    if (error.message.toLowerCase().includes('failed to fetch')) {
      throw new Error(
        'Request failed due to a connectivity issue. Please check your network connection.',
      );
    }

    throw error;
  }

  const contentType = response.headers.get('content-type');
  let responseBody;

  const responseClone = response.clone();

  if (contentType && contentType.includes('application/json')) {
    responseBody = await response.json();
  } else if (contentType?.includes('multipart/form-data') && response.body) {
    responseBody = await parseMultipart(response);
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

async function parseMultipart(response: Response) {
  const formData = await response.formData();
  const files = [];

  for (const entry of formData) {
    files.push({
      name: entry[0],
      file: entry[1],
    });
  }

  return files;
}
