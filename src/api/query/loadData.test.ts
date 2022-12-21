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

import {
  createDatabaseIfNotExists,
  getClient,
  getEngineName,
} from '../../testUtils';
import Client from '../client';

describe('Load data integration tests', () => {
  const databaseName = `js-sdk-tests-${Date.now()}`;
  const engineName = getEngineName();

  let client: Client;

  beforeAll(async () => {
    client = await getClient();

    await createDatabaseIfNotExists(client, databaseName);
  });

  afterAll(async () => {
    await client.deleteDatabase(databaseName);
  });

  describe('Load Json', () => {
    it('should load json data', async () => {
      let resp = await client.loadJson(
        databaseName,
        engineName,
        'test_relation',
        { test: 123 },
      );

      expect(resp.transaction.state).toEqual('COMPLETED');

      resp = await client.exec(
        databaseName,
        engineName,
        'def output = test_relation',
      );

      expect(resp.transaction.state).toEqual('COMPLETED');
      expect(resp.results[0].table.toArray()[0].toJSON()).toEqual({ v1: 123n });
    });
  });

  describe('Load Csv', () => {
    it('should load csv data', async () => {
      const csv = 'foo,bar\n1,2';
      let resp = await client.loadCsv(
        databaseName,
        engineName,
        'test_relation',
        csv,
      );

      expect(resp.transaction.state).toEqual('COMPLETED');

      resp = await client.exec(
        databaseName,
        engineName,
        'def output = test_relation',
      );

      expect(resp.transaction.state).toEqual('COMPLETED');
      expect(resp.results[0].table.toArray()[0].toJSON()).toEqual({
        v1: 2n,
        v2: '2',
      });
      expect(resp.results[1].table.toArray()[0].toJSON()).toEqual({
        v1: 2n,
        v2: '1',
      });
    });

    it('should load csv data with syntax', async () => {
      const csv = 'foo|bar\n1|2';
      let resp = await client.loadCsv(
        databaseName,
        engineName,
        'test_relation_1',
        csv,
        {
          header: { 1: 'foo', 2: 'bar' },
          delim: '|',
          quotechar: "'",
          header_row: 0,
          escapechar: ']',
        },
      );

      expect(resp.transaction.state).toEqual('COMPLETED');

      resp = await client.exec(
        databaseName,
        engineName,
        'def output = test_relation_1',
      );

      expect(resp.transaction.state).toEqual('COMPLETED');
      expect(resp.results[0].table.toArray()[0].toJSON()).toEqual({
        v1: 1n,
        v2: 'bar',
      });
      expect(resp.results[1].table.toArray()[0].toJSON()).toEqual({
        v1: 1n,
        v2: 'foo',
      });
    });

    it('should load csv data with schema', async () => {
      const csv = 'foo,bar\n1,test';
      let resp = await client.loadCsv(
        databaseName,
        engineName,
        'test_relation_2',
        csv,
        undefined,
        {
          ':foo': 'int',
          ':bar': 'string',
        },
      );

      expect(resp.transaction.state).toEqual('COMPLETED');

      resp = await client.exec(
        databaseName,
        engineName,
        'def output = test_relation_2',
      );

      expect(resp.transaction.state).toEqual('COMPLETED');
      expect(resp.results[0].table.toArray()[0].toJSON()).toEqual({
        v1: 2n,
        v2: 'test',
      });
      expect(resp.results[1].table.toArray()[0].toJSON()).toEqual({
        v1: 2n,
        v2: 1n,
      });
    });
  });
});
