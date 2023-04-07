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

enum PollingState {
  PENDING,
  FULFILLED,
  REJECTED,
}

export class PollingPromise<T = void> implements Promise<T> {
  private state: PollingState = PollingState.PENDING;
  private value: T | undefined = undefined;
  private chain: {
    onFulfilled: ((value: T) => any) | undefined | null;
    onRejected: ((reason: any) => any) | undefined | null;
  }[] = [];
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void | PromiseLike<void>,
    public timeoutMs = Number.POSITIVE_INFINITY,
    public intervalMs = 1000,
    public startTimeMs = Date.now(),
    public maxIntervalMs = 120000,
    public overheadRate = 0.3,
  ) {
    const poll = async (newInterval: number) => {
      await new Promise(res => setTimeout(res, newInterval));
      try {
        await executor(this._resolve, this._reject);
      } catch (error) {
        this._reject(error);
      }

      const currentDelay = Date.now() - this.startTimeMs;

      if (currentDelay > this.timeoutMs) {
        this._reject('Polling timeout');
      } else if (this.state === PollingState.PENDING) {
        poll(Math.min(this.maxIntervalMs, currentDelay * overheadRate));
      }
    };

    poll(this.intervalMs);
  }

  private _resolve = (value: T | PromiseLike<T>) => {
    this.updateState(value, PollingState.FULFILLED);
  };

  private _reject = (reason: any) => {
    this.updateState(reason, PollingState.REJECTED);
  };

  private isThenable = (value: any) => {
    return (
      typeof value === 'object' &&
      value.then &&
      typeof value.then === 'function'
    );
  };

  private updateState = (value: any, state: PollingState) => {
    setTimeout(() => {
      /*
        Process the promise if it is still in pending state.
        An already rejected or resolved promise cannot be processed
      */
      if (this.state !== PollingState.PENDING) {
        return;
      }

      // check if value is also a promise
      if (this.isThenable(value)) {
        return value.then(this._resolve, this._reject);
      }

      this.value = value;
      this.state = state;

      // execute chain if already attached
      this.executeChain();
    }, 0);
  };

  private pushToChain(handlers: {
    onFulfilled: ((value: T) => any) | undefined | null;
    onRejected: ((reason: any) => any) | undefined | null;
  }) {
    this.chain.push(handlers);
    this.executeChain();
  }

  private executeChain() {
    // Don't execute chain if promise is not yet fulfilled or rejected
    if (this.state === PollingState.PENDING) {
      return null;
    }

    // We have multiple handlers because add them for .finally block too
    this.chain.forEach(({ onFulfilled, onRejected }) => {
      if (this.state === PollingState.FULFILLED) {
        return onFulfilled?.(this.value!);
      }
      return onRejected?.(this.value);
    });
    // After processing the chain, reset to empty.
    this.chain = [];
  }

  readonly [Symbol.toStringTag]: string;

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?:
      | ((value: T) => PromiseLike<TResult1> | TResult1)
      | undefined
      | null,
    onRejected?:
      | ((reason: any) => PromiseLike<TResult2> | TResult2)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return new Promise((resolve, reject) => {
      this.pushToChain({
        onFulfilled: value => {
          // if no onFulfilled provided, resolve the value for the next promise chain
          if (!onFulfilled) {
            return resolve(value as any);
          }
          try {
            return resolve(onFulfilled(value));
          } catch (error) {
            return reject(error);
          }
        },
        onRejected: reason => {
          // if no onRejected provided, reject the value for the next promise chain
          if (!onRejected) {
            return reject(reason);
          }
          try {
            return resolve(onRejected(reason));
          } catch (error) {
            return reject(error);
          }
        },
      });
    });
  }

  catch<TResult = never>(
    onRejected?:
      | ((reason: any) => PromiseLike<TResult> | TResult)
      | undefined
      | null,
  ): Promise<T | TResult> {
    return this.then(null, onRejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return new Promise((resolve, reject) => {
      let val: any;
      let wasRejected = false;
      this.then(
        value => {
          wasRejected = false;
          val = value;
          return onfinally?.();
        },
        error => {
          wasRejected = true;
          val = error;
          return onfinally?.();
        },
      ).then(() => {
        if (!wasRejected) {
          return resolve(val);
        }
        return reject(val);
      });
    });
  }
}
