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

import { Response } from 'undici';

import { Credentials } from './credentials';

export const VERSION =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof __RAI_SDK_VERSION__ === 'undefined'
    ? 'to-be-replaced'
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      __RAI_SDK_VERSION__; // replaced at build time

export type Config = {
  host: string;
  port: string;
  scheme: string;
  credentials: Credentials;
};

export interface AccessTokenCache {
  access_token: string;
  expires_in: number;
  created_on: number;
}

export type ApiResponse = Pick<
  Response,
  'status' | 'statusText' | 'ok' | 'headers' | 'redirected'
> & {
  body: any;
};
