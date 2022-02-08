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
import { User, UserRole, UserStatus } from './types';
declare type DeleteResponse = {
    user_id: string;
    message: string;
};
export declare class UserApi extends Base {
    createUser(email: string, roles: UserRole[]): Promise<User>;
    listUsers(): Promise<User[]>;
    getUser(userId: string): Promise<User>;
    updateUser(userId: string, status?: UserStatus, roles?: UserRole[]): Promise<User>;
    enableUser(userId: string): Promise<User>;
    disableUser(userId: string): Promise<User>;
    deleteUser(userId: string): Promise<DeleteResponse>;
}
export {};
