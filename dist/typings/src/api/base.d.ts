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
import { RequestOptions } from '../rest';
import { Config } from '../types';
declare type OnResponse = RequestOptions['onResponse'];
export declare abstract class Base {
    config: Config;
    region: string;
    baseUrl: string;
    private _onResponse?;
    constructor(config: Config, region?: string);
    onResponse(onResponse: OnResponse): void;
    protected request<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T>;
    protected get<T>(path: string, query?: RequestOptions['query']): Promise<T>;
    protected post<T>(path: string, options: Pick<RequestOptions, 'query' | 'body'>): Promise<T>;
    protected put<T>(path: string, options: Pick<RequestOptions, 'query' | 'body'>): Promise<T>;
    protected patch<T>(path: string, options: Pick<RequestOptions, 'query' | 'body'>): Promise<T>;
    protected delete<T>(path: string, options: Pick<RequestOptions, 'query' | 'body'>): Promise<T>;
}
export {};
