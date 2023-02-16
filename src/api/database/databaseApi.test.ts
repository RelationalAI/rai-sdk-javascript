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

import { MockAgent } from 'undici';

import {
  baseUrl,
  createMockAgent,
  getMockConfig,
  mockResponseHeaders,
} from '../../testUtils';
import { DatabaseApi } from './databaseApi';
import { DatabaseState } from './types';

const path = '/database';

describe('DatabaseApi', () => {
  const api = new DatabaseApi(getMockConfig());
  const mockDatabases = [{ name: 'database-1' }, { name: 'database-2' }];
  let agent: MockAgent;

  beforeEach(() => {
    agent = createMockAgent();
  });

  it('should create database', async () => {
    const response = { database: mockDatabases[0] };

    agent
      .get(baseUrl)
      .intercept({
        path,
        method: 'PUT',
        body: JSON.stringify({
          name: 'test-database',
        }),
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.createDatabase('test-database');

    expect(result).toEqual(mockDatabases[0]);
  });

  it('should list databases', async () => {
    const response = { databases: mockDatabases };

    agent
      .get(baseUrl)
      .intercept({ path })
      .reply(200, response, mockResponseHeaders);

    const result = await api.listDatabases();

    expect(result).toEqual(mockDatabases);
  });

  it('should list databases with params', async () => {
    const response = { databases: mockDatabases };
    const query = {
      name: ['n1', 'n2'],
      state: DatabaseState.CREATED,
    };

    agent
      .get(baseUrl)
      .intercept({
        path,
        query,
      })
      .reply(200, response, mockResponseHeaders);
    const result = await api.listDatabases(query);

    expect(result).toEqual(mockDatabases);
  });

  it('should get database', async () => {
    const response = { databases: mockDatabases };

    agent
      .get(baseUrl)
      .intercept({
        path,
        query: { name: 'test-database' },
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.getDatabase('test-database');

    expect(result).toEqual(mockDatabases[0]);
  });

  it('should delete database', async () => {
    const response = { message: 'deleted' };

    agent
      .get(baseUrl)
      .intercept({
        path,
        method: 'DELETE',
        body: JSON.stringify({ name: 'test-database' }),
      })
      .reply(200, response, mockResponseHeaders);
    const result = await api.deleteDatabase('test-database');

    expect(result).toEqual(response);
  });
});
