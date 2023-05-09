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
import lodash from 'lodash';
import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const packageJson = JSON.parse(readFileSync('./package.json'));
const outDir = 'dist';
const libName = `rai-sdk-javascript`;

const baseConfig = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: true,
              outDir: path.resolve(outDir, 'typings'),
            },
            onlyCompileBundledFiles: true,
          },
        },
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
      [path.resolve('./src/fetch.node.ts')]: path.resolve('./src/fetch.web.ts'),
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
      [path.resolve('./src/fetch.node.ts')]: path.resolve('./src/fetch.web.ts'),
    },
  },
});

const nodeEsm = lodash.merge({}, baseConfig, {
  entry: './index.node.ts',
  experiments: {
    outputModule: true,
  },
  output: {
    filename: `${libName}.module.js`,
    path: path.resolve(outDir, 'node'),
    library: {
      type: 'module',
    },
    chunkFormat: 'module',
  },
  target: 'node',
  externalsPresets: { node: true },
  externals: [nodeExternals({ importType: 'module' })],
});

const nodeCjs = lodash.merge({}, baseConfig, {
  entry: './index.node.ts',
  output: {
    filename: `${libName}.cjs`,
    path: path.resolve(outDir, 'node'),
    library: {
      type: 'commonjs',
    },
  },
  target: 'node',
  externals: [nodeExternals()],
});

const configs = [webEsm, webCjs, nodeEsm, nodeCjs];

configs.forEach(config => {
  config.plugins = [
    new webpack.DefinePlugin({
      __RAI_SDK_VERSION__: `"${packageJson.version}"`,
    }),
  ];
});

export default configs;
