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
import { AccessTokenCache } from './types';
export declare abstract class Credentials {
    abstract getToken(url: string): Promise<string>;
}
declare type GetToken = (url: string) => Promise<string>;
export declare class GetTokenCredentials extends Credentials {
    getToken: GetToken;
    constructor(getToken: GetToken);
}
declare class AccessToken {
    token: string;
    experiesIn: number;
    createdOn: number;
    constructor(token: string, experiesIn: number, createdOn: number);
    get isExpired(): boolean;
}
declare type ReadCacheFn = () => Promise<AccessTokenCache | undefined>;
declare type WriteCacheFn = (c: AccessTokenCache) => Promise<void>;
export declare class ClientCredentials extends Credentials {
    private readCache?;
    private writeCache?;
    clientId: string;
    clientSecret: string;
    clientCredentialsUrl: string;
    accessToken?: AccessToken;
    constructor(clientId: string, clientSecret: string, clientCredentialsUrl: string, readCache?: ReadCacheFn | undefined, writeCache?: WriteCacheFn | undefined);
    getToken(requestedUrl: string): Promise<string>;
    private readTokenFromCache;
    private requestToken;
}
export {};