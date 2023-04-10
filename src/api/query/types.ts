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

import { RelValue } from '../transaction/types';

export type QueryInput = {
  name: string;
  value: RelValue;
};

export type CsvConfigSyntax = {
  header?: {
    [colNumber: string]: string;
  };
  header_row?: number;
  delim?: string;
  quotechar?: string;
  escapechar?: string;
};

export type CsvConfigSchema = {
  [colName: string]: string;
};

export type PollTransactionOptions = {
  timeout?: number;
  startTime?: number;
};
