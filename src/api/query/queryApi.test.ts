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

import {
  baseUrl,
  getMockConfig,
  makeTransactionRequest,
  makeTransactionResult,
} from '../../testUtils';
import { Relation } from '../transaction/types';
import { QueryApi } from './queryApi';

describe('QueryApi', () => {
  const api = new QueryApi(getMockConfig());
  const mockOutput: Relation[] = [
    {
      rel_key: {
        values: [],
        name: 'output',
        keys: ['Int64'],
        type: 'RelKey',
      },
      type: 'Relation',
      columns: [[123]],
    },
    {
      rel_key: {
        values: [],
        name: 'foo',
        keys: ['Int64'],
        type: 'RelKey',
      },
      type: 'Relation',
      columns: [[111]],
    },
  ];
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should query', async () => {
    const request = makeTransactionRequest(
      [
        {
          type: 'QueryAction',
          outputs: [],
          persist: [],
          inputs: [],
          source: {
            value: 'def output {123}',
            name: 'query',
            type: 'Source',
            path: '',
          },
        },
      ],
      database,
      engine,
    );
    const response = makeTransactionResult([
      {
        type: 'QueryActionResult',
        output: [],
      },
    ]);
    response.output = mockOutput;

    const scope = nock(baseUrl)
      .post('/transaction', request)
      .query({
        dbname: database,
        open_mode: 'OPEN',
        region: 'us-east',
        compute_name: engine,
      })
      .reply(200, response);

    const result = await api.query(database, engine, 'def output {123}');

    scope.done();

    expect(result).toEqual(response);
  });

  it('should query with inputs', async () => {
    const request = makeTransactionRequest(
      [
        {
          type: 'QueryAction',
          outputs: [],
          persist: [],
          inputs: [
            {
              rel_key: {
                values: [],
                name: 'input1',
                keys: ['RAI_VariableSizeStrings.VariableSizeString'],
                type: 'RelKey',
              },
              type: 'Relation',
              columns: [['value1']],
            },
          ],
          source: {
            value: 'def output {123}',
            name: 'query',
            type: 'Source',
            path: '',
          },
        },
      ],
      database,
      engine,
    );
    const response = makeTransactionResult([
      {
        type: 'QueryActionResult',
        output: [],
      },
    ]);
    response.output = mockOutput;

    const scope = nock(baseUrl)
      .post('/transaction', request)
      .query({
        dbname: database,
        open_mode: 'OPEN',
        region: 'us-east',
        compute_name: engine,
      })
      .reply(200, response);
    const result = await api.query(database, engine, 'def output {123}', [
      { name: 'input1', value: 'value1' },
    ]);

    scope.done();

    expect(result).toEqual(response);
  });
});
