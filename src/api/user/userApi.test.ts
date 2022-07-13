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
import { UserRole, UserStatus } from './types';
import { UserApi } from './userApi';

const path = '/users';

describe('UserApi', () => {
  const api = new UserApi(getMockConfig());
  const mockUsers = [{ email: 'test1@test.com' }, { name: 'test1@test.com' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .post(path, {
        email: 'test1@test.com',
        roles: [UserRole.ADMIN],
      })
      .reply(200, response);
    const result = await api.createUser('test1@test.com', [UserRole.ADMIN]);

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should list users', async () => {
    const response = { users: mockUsers };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await api.listUsers();

    scope.done();

    expect(result).toEqual(mockUsers);
  });

  it('should get user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl).get(`${path}/id1`).reply(200, response);
    const result = await api.getUser('id1');

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should update user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        roles: [UserRole.USER],
      })
      .reply(200, response);
    const result = await api.updateUser('id1', undefined, [UserRole.USER]);

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should enable user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        status: UserStatus.ACTIVE,
      })
      .reply(200, response);
    const result = await api.enableUser('id1');

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should disable user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        status: UserStatus.INACTIVE,
      })
      .reply(200, response);
    const result = await api.disableUser('id1');

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should delete user', async () => {
    const response = { message: 'deleted' };
    const scope = nock(baseUrl).delete(`${path}/id1`).reply(200, response);
    const result = await api.deleteUser('id1');

    scope.done();

    expect(result).toEqual(response);
  });
});
