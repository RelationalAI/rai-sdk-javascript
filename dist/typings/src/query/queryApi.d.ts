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
import { CsvConfigSchema, CsvConfigSyntax, QueryInput } from './types';
export declare class QueryApi extends TransactionApi {
    query(database: string, engine: string, queryString: string, inputs?: QueryInput[], readonly?: boolean): Promise<import("../..").TransactionResult>;
    loadJson(database: string, engine: string, relation: string, json: any): Promise<import("../..").TransactionResult>;
    loadCsv(database: string, engine: string, relation: string, csv: string, syntax?: CsvConfigSyntax, schema?: CsvConfigSchema): Promise<import("../..").TransactionResult>;
}
