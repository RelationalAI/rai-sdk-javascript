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

const engineName = process.env.GITHUB_ACTIONS
  ? `js-sdk-tests-${Date.now()}`
  : `js-sdk-tests-engine-local`;
const timeout = 120000;

// for global setup/teardown
globalThis.__RAI_SDK_VERSION__ = pkg.version;
globalThis.__RAI_ENGINE__ = engineName;
globalThis.__RAI_TIMEOUT__ = timeout;

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  globals: {
    // for the test files
    __RAI_SDK_VERSION__: pkg.version,
    __RAI_ENGINE__: engineName,
    __RAI_TIMEOUT__: timeout,
  },
  globalSetup: '<rootDir>/jest.setup.ts',
  globalTeardown: '<rootDir>/jest.teardown.ts',
  testTimeout: timeout,
  reporters: ['<rootDir>/jest.reporter.js', 'summary'],
};

export default config;
