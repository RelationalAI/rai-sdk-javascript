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

import DeclarationBundlerPlugin from 'declaration-bundler-webpack-plugin';
import lodash from 'lodash';
import path from 'path';

const outDir = 'dist';
const libName = `rai-sdk-javascript`;

const baseConfig = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

const webEsm = lodash.merge({}, baseConfig, {
  entry: './index.web.ts',
  experiments: {
    outputModule: true,
  },
  output: {
    filename: `${libName}.module.js`,
    path: path.resolve(outDir, 'web'),
    library: {
      type: 'module',
    },
  },
  target: 'web',
  resolve: {
    alias: {
      'node-fetch': path.resolve('fetch.ts'),
    },
  },
});

const webCjs = lodash.merge({}, baseConfig, {
  entry: './index.web.ts',
  output: {
    filename: `${libName}.cjs`,
    path: path.resolve(outDir, 'web'),
    library: {
      type: 'commonjs',
    },
  },
  target: 'web',
  resolve: {
    alias: {
      'node-fetch': path.resolve('fetch.ts'),
    },
  },
});

webEsm.plugins = [
  new DeclarationBundlerPlugin({
    moduleName: 'some.path.moduleName',
    out: './dist/typings/index.web.d.ts',
  }),
];

export default [webEsm, webCjs];
