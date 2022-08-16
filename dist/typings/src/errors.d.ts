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
export declare class ApiError extends Error {
    message: string;
    status: string;
    details: string;
    response: Response;
    constructor(message: string, status: string, details: string, response: Response);
    toString(): string;
}
export declare class TransactionError extends Error {
    message: string;
    result: TransactionResult;
    response: Response;
    constructor(result: TransactionResult, response: Response);
    toString(): string;
}
export declare function makeError(body: any, response: Response): TransactionError | ApiError;
export declare type SdkError = ApiError | TransactionError | Error;
