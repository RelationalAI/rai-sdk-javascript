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

import { TransactionResult } from './api/transaction/types';
import { ApiResponse } from './types';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status = '',
    public details = '',
    public response: ApiResponse,
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
  response: ApiResponse;

  constructor(result: TransactionResult, response: ApiResponse) {
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

export function makeError(body: any, response: ApiResponse) {
  if (body?.type === 'TransactionResult') {
    return new TransactionError(body, response);
  }

  return new ApiError(
    body?.message || response.statusText || response.status,
    body?.status || response.status,
    body?.details,
    response,
  );
}

export class MaxRelationSizeError extends Error {
  constructor(
    public relationId: string,
    public relationSize: number,
    public maxSize: number,
  ) {
    const message = `Maximum relation size of ${maxSize} bytes exceeded. Relation: ${relationId}`;

    super(message);

    this.name = 'MaxRelationSizeError';
  }
}

export class EmptyRelationError extends Error {
  constructor(public relationId: string) {
    const message = `Unexpected 0 bytes relation. Relation: ${relationId}`;

    super(message);

    this.name = 'EmptyRelationError';
  }
}

export class AbortError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'AbortError';
  }

  toString() {
    return this.message ?? this.name;
  }
}

export type SdkError =
  | AbortError
  | ApiError
  | TransactionError
  | MaxRelationSizeError
  | EmptyRelationError
  | Error;
