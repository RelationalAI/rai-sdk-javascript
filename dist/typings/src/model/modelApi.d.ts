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
import { TransactionApi } from '../transaction/transactionApi';
import { Model } from '../transaction/types';
export declare class ModelApi extends TransactionApi {
    installModels(database: string, engine: string, models: Model[]): Promise<import("../transaction/types").InstallActionResult>;
    listModels(database: string, engine: string): Promise<Model[]>;
    getModel(database: string, engine: string, name: string): Promise<Model>;
    deleteModel(database: string, engine: string, name: string): Promise<import("../transaction/types").ModifyWorkspaceActionResult>;
}
