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

import nock from 'nock';

import { baseUrl, getMockConfig } from '../testUtils';
import { DatabaseApi } from './databaseApi';
import { DatabaseState } from './types';

const path = '/database';

describe('DatabaseApi', () => {
  const api = new DatabaseApi(getMockConfig());
  const mockDatabases = [{ name: 'database-1' }, { name: 'database-2' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create database', async () => {
    const response = { database: mockDatabases[0] };
    const scope = nock(baseUrl)
      .put(path, {
        name: 'test-database',
      })
      .reply(200, response);
    const result = await api.createDatabase('test-database');

    scope.done();

    expect(result).toEqual(mockDatabases[0]);
  });

  it('should list databases', async () => {
    const response = { databases: mockDatabases };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await api.listDatabases();

    scope.done();

    expect(result).toEqual(mockDatabases);
  });

  it('should list databases with params', async () => {
    const response = { databases: mockDatabases };
    const query = {
      name: ['n1', 'n2'],
      state: DatabaseState.CREATED,
    };
    const scope = nock(baseUrl).get(path).query(query).reply(200, response);
    const result = await api.listDatabases(query);

    scope.done();

    expect(result).toEqual(mockDatabases);
  });

  it('should get database', async () => {
    const response = { databases: mockDatabases };
    const scope = nock(baseUrl)
      .get(path)
      .query({ name: 'test-database' })
      .reply(200, response);
    const result = await api.getDatabase('test-database');

    scope.done();

    expect(result).toEqual(mockDatabases[0]);
  });

  it('should delete database', async () => {
    const response = { message: 'deleted' };
    const scope = nock(baseUrl)
      .delete(path, { name: 'test-database' })
      .reply(200, response);
    const result = await api.deleteDatabase('test-database');

    scope.done();

    expect(result).toEqual(response);
  });
});
