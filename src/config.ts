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

/* eslint-env node */
/* eslint-disable no-console */

import { ConfigIniParser } from 'config-ini-parser';
import { promises } from 'fs';
import { homedir } from 'os';

import { ClientCredentials } from './credentials';
import { AccessTokenCache, Config } from './types';

const { readFile, writeFile } = promises;

// client id, token map
type TokensCache = Record<string, AccessTokenCache>;

export async function readConfig(
  profile = 'default',
  configPath = '~/.rai/config',
) {
  configPath = resolveHome(configPath);

  try {
    const strCfg = await readFile(configPath, 'utf-8');
    const configParser = new ConfigIniParser();

    configParser.parse(strCfg);

    if (!configParser.isHaveSection(profile)) {
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

  const clientId = configParser.get(profile, 'client_id', '');
  const config: Config = {
    host: configParser.get(profile, 'host', ''),
    port: configParser.get(profile, 'port', DEFAULT_PORT),
    scheme: configParser.get(profile, 'scheme', DEFAULT_SCHEME),
    credentials: new ClientCredentials(
      clientId,
      configParser.get(profile, 'client_secret', ''),
      configParser.get(
        profile,
        'client_credentials_url',
        DEFAULT_CLIENT_CREDENTIALS_URL,
      ),
      async () => await readTokenCache(clientId),
      async cache => await writeTokenCache(clientId, cache),
    ),
  };

  return config;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

function resolveHome(path: string) {
  if (path.startsWith('~/')) {
    return `${homedir()}/${path.slice(2)}`;
  }

  return path;
}

const CACHE_PATH = '~/.rai/tokens.json';

async function readTokenCache(clientId: string) {
  const cachePath = resolveHome(CACHE_PATH);

  try {
    const cachedStr = await readFile(cachePath, 'utf-8');
    const tokensCache = JSON.parse(cachedStr) as TokensCache;
    const cache = tokensCache[clientId];

    if (cache.access_token && cache.created_on && cache.expires_in) {
      return cache as AccessTokenCache;
    }
    // eslint-disable-next-line no-empty
  } catch {}
}

async function writeTokenCache(clientId: string, token: AccessTokenCache) {
  const cachePath = resolveHome(CACHE_PATH);
  let tokensCache: TokensCache = {};

  try {
    const cachedStr = await readFile(cachePath, 'utf-8');

    tokensCache = JSON.parse(cachedStr) as TokensCache;
    // eslint-disable-next-line no-empty
  } catch {}

  tokensCache[clientId] = token;

  const cacheStr = JSON.stringify(tokensCache, null, 2);

  await writeFile(cachePath, cacheStr, 'utf-8');
}
