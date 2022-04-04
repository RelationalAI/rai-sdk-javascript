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

import { Base } from './base';
import { DatabaseApi } from './database/databaseApi';
import { EdbApi } from './edb/edbApi';
import { EngineApi } from './engine/engineApi';
import { ModelApi } from './model/modelApi';
import { OAuthClientApi } from './oauthClient/oauthClientApi';
import { ExecAsyncApi } from './query/execAsyncApi';
import { QueryApi } from './query/queryApi';
import { TransactionApi } from './transaction/transactionApi';
import { TransactionAsyncApi } from './transaction/transactionAsyncApi';
import { UserApi } from './user/userApi';
import { applyMixins } from './utils';

class Client extends Base {}

// eslint-disable-next-line no-redeclare
interface Client
  extends DatabaseApi,
    EdbApi,
    EngineApi,
    ModelApi,
    OAuthClientApi,
    ExecAsyncApi,
    QueryApi,
    TransactionApi,
    TransactionAsyncApi,
    UserApi {}

applyMixins(Client, [
  DatabaseApi,
  EdbApi,
  EngineApi,
  ModelApi,
  OAuthClientApi,
  ExecAsyncApi,
  QueryApi,
  TransactionApi,
  TransactionAsyncApi,
  UserApi,
]);

export default Client;
