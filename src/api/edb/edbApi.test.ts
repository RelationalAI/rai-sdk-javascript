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
  makeTransactionRequest,
  makeTransactionResult,
  mockResponseHeaders,
} from '../../testUtils';
import { RelKey } from '../transaction/types';
import { EdbApi } from './edbApi';

describe('EdbApi', () => {
  const api = new EdbApi(getMockConfig());
  const mockEdbs: RelKey[] = [
    {
      values: ['RAI_VariableSizeStrings.VariableSizeString'],
      name: 'edb1',
      keys: [':region', 'RelationalAITypes.FilePos'],
      type: 'RelKey',
    },
    {
      values: ['RAI_VariableSizeStrings.VariableSizeString'],
      name: 'edb2',
      keys: [':region', 'RelationalAITypes.FilePos'],
      type: 'RelKey',
    },
  ];
  const database = 'test-db';
  const engine = 'test-engine';
  const path = '/transaction';
  const query = {
    dbname: database,
    open_mode: 'OPEN',
    region: 'us-east',
    compute_name: engine,
  };
  let agent: MockAgent;

  beforeEach(() => {
    agent = createMockAgent();
  });

  it('should list edbs', async () => {
    const request = makeTransactionRequest(
      [{ type: 'ListEdbAction' }],
      database,
      engine,
    );
    const response = makeTransactionResult([
      {
        type: 'ListEdbActionResult',
        rels: mockEdbs,
      },
    ]);

    agent
      .get(baseUrl)
      .intercept({
        path,
        method: 'POST',
        body: JSON.stringify(request),
        query,
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.listEdbs(database, engine);

    expect(result).toEqual(mockEdbs);
  });

  it('should delete edb', async () => {
    const request = makeTransactionRequest(
      [
        {
          type: 'ModifyWorkspaceAction',
          delete_edb: 'edb1',
        },
      ],
      database,
      engine,
      false,
    );
    const response = makeTransactionResult([
      {
        type: 'ModifyWorkspaceActionResult',
        delete_edb_result: [mockEdbs[1]],
      },
    ]);

    agent
      .get(baseUrl)
      .intercept({
        path,
        method: 'POST',
        body: JSON.stringify(request),
        query,
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.deleteEdb(database, engine, 'edb1');

    expect(result).toEqual([mockEdbs[1]]);
  });
});
