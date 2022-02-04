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

import { getMockConfig, nockTransaction } from '../testUtils';
import { ModelApi } from './modelApi';

describe('ModelApi', () => {
  const api = new ModelApi(getMockConfig());
  const mockModels = [
    { name: 'model1', value: 'value1', type: '' },
    { name: 'model2', value: 'value2', type: '' },
  ];
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should install model', async () => {
    const scope = nockTransaction(
      [
        {
          type: 'InstallAction',
          sources: mockModels,
        },
      ],
      [
        {
          type: 'InstallActionResult',
        },
      ],
      database,
      engine,
      false,
    );
    const result = await api.installModels(database, engine, mockModels);

    scope.done();

    expect(result).toEqual({
      type: 'InstallActionResult',
    });
  });

  it('should list models', async () => {
    const scope = nockTransaction(
      [
        {
          type: 'ListSourceAction',
        },
      ],
      [
        {
          type: 'ListSourceActionResult',
          sources: mockModels,
        },
      ],
      database,
      engine,
    );
    const result = await api.listModels(database, engine);

    scope.done();

    expect(result).toEqual(mockModels);
  });

  it('should get model', async () => {
    const scope = nockTransaction(
      [
        {
          type: 'ListSourceAction',
        },
      ],
      [
        {
          type: 'ListSourceActionResult',
          sources: mockModels,
        },
      ],
      database,
      engine,
    );
    const result = await api.getModel(database, engine, 'model2');

    scope.done();

    expect(result).toEqual(mockModels[1]);
  });

  it('should delete model', async () => {
    const scope = nockTransaction(
      [
        {
          type: 'ModifyWorkspaceAction',
          delete_source: ['model1'],
        },
      ],
      [
        {
          type: 'ModifyWorkspaceActionResult',
        },
      ],
      database,
      engine,
      false,
    );
    const result = await api.deleteModel(database, engine, 'model1');

    scope.done();

    expect(result).toEqual({
      type: 'ModifyWorkspaceActionResult',
    });
  });
});
