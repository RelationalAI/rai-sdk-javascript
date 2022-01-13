// Copyright 2022 RelationalAI, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-env node */
/* eslint-disable no-console */

import { ConfigIniParser } from 'config-ini-parser';
import { promises } from 'fs';
import { homedir } from 'os';

import { Config } from './types';

const { readFile } = promises;

export async function readConfig(
  profile = 'default',
  configPath = '~/.rai/config',
) {
  configPath = resolveHome(configPath);

  try {
    const strCfg = await readFile(configPath, 'utf-8');
    const configParser = new ConfigIniParser();

    configParser.parse(strCfg);

    const sections = configParser.sections();

    if (!sections.includes(profile)) {
      throw new Error(`Profile '${profile}' not found in ${configPath}`);
    }

    return readClientCredentials(configParser, profile);
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new Error(`Can't find file: ${configPath}`);
    } else {
      throw error;
    }
  }
}

const REQUIRED_FIELDS = ['host', 'client_id', 'client_secret'];
const DEFAULT_PORT = '443';
const DEFAULT_SCHEME = 'https';
const DEFAULT_CLIENT_CREDENTIALS_URL =
  'https://login.relationalai.com/oauth/token';

function readClientCredentials(configParser: ConfigIniParser, profile: string) {
  for (const field of REQUIRED_FIELDS) {
    if (!configParser.get(profile, field, '')) {
      throw new Error(`Can't find ${field} field in ${profile} profile`);
    }
  }

  const config: Config = {
    host: configParser.get(profile, 'host', ''),
    port: configParser.get(profile, 'port', DEFAULT_PORT),
    scheme: configParser.get(profile, 'scheme', DEFAULT_SCHEME),
    clientId: configParser.get(profile, 'client_id', ''),
    clientSecret: configParser.get(profile, 'client_secret', ''),
    clientCredentialsUrl: configParser.get(
      profile,
      'client_credentials_url',
      DEFAULT_CLIENT_CREDENTIALS_URL,
    ),
  };

  return config;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

function resolveHome(path: string) {
  if (path.startsWith('~/')) {
    return homedir() + '/' + path.slice(2);
  }

  return path;
}
