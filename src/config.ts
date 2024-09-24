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

import { promises } from 'fs';
import { parse } from 'ini';
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

    const config = parse(strCfg);

    if (!config || !config[profile]) {
      throw new Error(`Profile '${profile}' not found in ${configPath}`);
    }

    return readClientCredentials(config, profile);
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

function readClientCredentials(cfg: Record<string, any>, profile: string) {
  const _p = cfg[profile];
  for (const field of REQUIRED_FIELDS) {
    if (!_p[field]) {
      throw new Error(`Can't find ${field} field in ${profile} profile`);
    }
  }

  const clientId = _p['client_id'] || '';
  const config: Config = {
    host: _p['host'] || '',
    port: _p['port'] || DEFAULT_PORT,
    scheme: _p['scheme'] || DEFAULT_SCHEME,
    credentials: new ClientCredentials(
      clientId,
      _p['client_secret'] || '',
      _p['client_credentials_url'] || DEFAULT_CLIENT_CREDENTIALS_URL,
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
