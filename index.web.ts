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

export { default as Client } from './src/api/client';
export * from './src/api/database/types';
export * from './src/api/engine/types';
export * from './src/api/oauthClient/types';
export * from './src/api/query/types';
export * from './src/api/transaction/types';
export * from './src/api/user/types';
export * from './src/credentials';
export type { SdkError } from './src/errors';
export {
  AbortError,
  ApiError,
  EmptyRelationSizeError,
  MaxRelationSizeError,
  TransactionError,
} from './src/errors';
export * from './src/proto/generated/message';
export * from './src/proto/generated/schema';
export * from './src/results/resultTable';
export * from './src/results/resultUtils';
export * from './src/results/types';
export { VERSION } from './src/types';
