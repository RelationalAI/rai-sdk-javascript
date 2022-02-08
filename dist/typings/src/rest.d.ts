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
import { Problem } from './transaction/types';
export declare type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    query?: Record<string, any>;
    onResponse?: (r: Response) => void;
};
export declare function makeUrl(scheme: string, host: string, port: string): string;
export declare class SdkError extends Error {
    status: string;
    message: string;
    details?: string;
    problems?: Problem[];
    response: Response;
    constructor(body: any, response: Response);
    toString(): string;
}
export declare function request<T>(url: string, options?: RequestOptions): Promise<T>;
