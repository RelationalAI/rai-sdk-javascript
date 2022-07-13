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

import { baseUrl, getMockConfig } from '../../testUtils';
import { OAuthClientApi } from './oauthClientApi';
import { Permission } from './types';

const path = '/oauth-clients';

describe('OAuthClientApi', () => {
  const api = new OAuthClientApi(getMockConfig());
  const mockClients = [
    { id: 'id1', name: 'client1' },
    { id: 'id2', name: 'client2' },
  ];
  const mockPermissions = [
    { name: 'create:database', description: 'Create databases' },
    { name: 'delete:user', description: 'Delete users' },
  ];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create oauth client', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl)
      .post(path, {
        name: 'client1',
        permissions: [Permission.CREATE_COMPUTE, Permission.CREATE_USER],
      })
      .reply(200, response);
    const result = await api.createOAuthClient('client1', [
      Permission.CREATE_COMPUTE,
      Permission.CREATE_USER,
    ]);

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should list oauth clients', async () => {
    const response = { clients: mockClients };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await api.listOAuthClients();

    scope.done();

    expect(result).toEqual(mockClients);
  });

  it('should get oauth client', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl).get(`${path}/id1`).reply(200, response);
    const result = await api.getOAuthClient('id1');

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should update oauth client', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        name: 'client1',
        permissions: [Permission.CREATE_COMPUTE, Permission.CREATE_USER],
      })
      .reply(200, response);
    const result = await api.updateOAuthClient('id1', 'client1', [
      Permission.CREATE_COMPUTE,
      Permission.CREATE_USER,
    ]);

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should rotate oauth client secret', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl)
      .post(`${path}/id1/rotate-secret`)
      .reply(200, response);
    const result = await api.rotateOAuthClientSecret('id1');

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should delete oauth client', async () => {
    const response = { message: 'deleted' };
    const scope = nock(baseUrl).delete(`${path}/id1`).reply(200, response);
    const result = await api.deleteOAuthClient('id1');

    scope.done();

    expect(result).toEqual(response);
  });

  it('should list permissions', async () => {
    const response = { permissions: mockPermissions };
    const scope = nock(baseUrl).get('/permissions').reply(200, response);
    const result = await api.listPermissions();

    scope.done();

    expect(result).toEqual(mockPermissions);
  });
});
