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
import { EngineApi } from './engineApi';
import { EngineSize, EngineState } from './types';

const path = '/compute';

describe('EngineApi', () => {
  const api = new EngineApi(getMockConfig());
  const mockEngines = [{ name: 'engine-1' }, { name: 'engine-2' }];
  let agent: MockAgent;

  beforeEach(() => {
    agent = createMockAgent();
  });

  it('should create engine', async () => {
    const response = { compute: mockEngines[0] };

    agent
      .get(baseUrl)
      .intercept({
        path,
        method: 'PUT',
        body: JSON.stringify({
          region: 'us-east',
          name: 'test-engine',
          size: EngineSize.S,
        }),
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.createEngine('test-engine', EngineSize.S);

    expect(result).toEqual(mockEngines[0]);
  });

  it('should list engines', async () => {
    const response = { computes: mockEngines };

    agent
      .get(baseUrl)
      .intercept({ path })
      .reply(200, response, mockResponseHeaders);

    const result = await api.listEngines();

    expect(result).toEqual(mockEngines);
  });

  it('should list engines with params', async () => {
    const response = { computes: mockEngines };
    const query = {
      id: 'test-id',
      state: [EngineState.PROVISIONED, EngineState.PROVISIONING],
    };

    agent
      .get(baseUrl)
      .intercept({ path, query })
      .reply(200, response, mockResponseHeaders);

    const result = await api.listEngines(query);

    expect(result).toEqual(mockEngines);
  });

  it('should get engine', async () => {
    const response = { computes: mockEngines };

    agent
      .get(baseUrl)
      .intercept({
        path,
        query: { name: 'test-engine' },
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.getEngine('test-engine');

    expect(result).toEqual(mockEngines[0]);
  });

  it('should delete engine', async () => {
    const response = { status: { message: 'deleted' } };

    agent
      .get(baseUrl)
      .intercept({
        path,
        method: 'DELETE',
        body: JSON.stringify({ name: 'test-engine' }),
      })
      .reply(200, response, mockResponseHeaders);

    const result = await api.deleteEngine('test-engine');

    expect(result).toEqual(response.status);
  });
});
