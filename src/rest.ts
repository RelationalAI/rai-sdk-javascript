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

import { stringify } from 'query-string';

import { makeError } from './errors';
import { getFetch, Response } from './fetch.node';
import { ApiResponse, VERSION } from './types';

const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, any>;
  onResponse?: (r: ApiResponse) => void;
};

export type PollOptions = {
  overheadRate?: number;
  startTime?: number;
  maxInterval?: number;
  timeout?: number;
};

export type PollingResult<T> = {
  done: boolean;
  result?: T;
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

  let response;

  try {
    const fetch = getFetch();

    response = await fetch(fullUrl, opts);
  } catch (error: any) {
    const errorMsg = error.message.toLowerCase();

    if (
      errorMsg.includes('failed to fetch') || // Chrome
      errorMsg.includes('networkerror when attempting to fetch resource') // Firefox
    ) {
      throw new Error(
        'Request failed due to a connectivity issue. Please check your network connection.',
      );
    }

    throw error;
  }

  const contentType = response.headers.get('content-type');
  let responseBody;

  try {
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else if (contentType && contentType.includes('application/x-protobuf')) {
      responseBody = await response.blob();
    } else if (contentType?.includes('multipart/form-data') && response.body) {
      responseBody = await parseMultipart(response);
    } else {
      responseBody = await response.text();
    }
  } catch (error: any) {
    const err = new Error('Failed to read server response.');
    (err as any).cause = error;

    throw err;
  }

  if (options.onResponse) {
    try {
      options.onResponse(responseToInfo(response, responseBody));
      // eslint-disable-next-line no-empty
    } catch {}
  }

  if (response.ok) {
    return responseBody as T;
  }

  throw makeError(responseBody, responseToInfo(response, responseBody));
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

function responseToInfo(response: Response, body: any) {
  const info: ApiResponse = {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    headers: response.headers,
    redirected: response.redirected,
    body,
  };

  return info;
}

export async function pollWithOverhead<T = void>(
  callback: () => PollingResult<T> | PromiseLike<PollingResult<T>>,
  options?: PollOptions,
) {
  const overheadRate = options?.overheadRate ?? 0.1;
  const startTime = options?.startTime ?? Date.now();
  const timeout = options?.timeout ?? Number.POSITIVE_INFINITY;
  const maxInterval = options?.maxInterval ?? 120000;
  return new Promise<T>((resolve, reject) => {
    const poll = (delay: number) => {
      setTimeout(async () => {
        const pollingResult = await callback();
        if (pollingResult.done && pollingResult.result) {
          resolve(pollingResult.result);
          return;
        }

        const currentDelay = Date.now() - startTime;
        if (currentDelay > timeout) {
          reject(
            new Error(`Polling timeout of ${timeout}ms has been exceeded.`),
          );
          return;
        }
        poll(Math.min(maxInterval, currentDelay * overheadRate));
      }, delay);
    };

    poll(Math.min(maxInterval, (Date.now() - startTime) * overheadRate));
  });
}
