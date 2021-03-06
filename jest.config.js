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

import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  transformIgnorePatterns: [
    'node_modules/(?!(fetch-blob|node-fetch|data-uri-to-buffer|formdata-polyfill)/)',
  ],
  testEnvironment: 'node',
  globals: {
    __RAI_SDK_VERSION__: pkg.version,
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
};

export default exports;
