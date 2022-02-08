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
import { Base } from '../base';
import { CompactOAuthClient, OAuthClient, Permission } from './types';
declare type DeleteResponse = {
    client_id: string;
    message: string;
};
export declare class OAuthClientApi extends Base {
    createOAuthClient(name: string, permissions?: Permission[]): Promise<OAuthClient>;
    listOAuthClients(): Promise<CompactOAuthClient[]>;
    getOAuthClient(clientId: string): Promise<OAuthClient>;
    updateOAuthClient(clientId: string, name?: string, permissions?: Permission[]): Promise<OAuthClient>;
    rotateOAuthClientSecret(clientId: string): Promise<OAuthClient>;
    deleteOAuthClient(clientId: string): Promise<DeleteResponse>;
}
export {};
