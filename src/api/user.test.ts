import nock from 'nock';

import { baseUrl, getMockContext } from './testUtils';
import * as endpoint from './user';

const path = '/users';

describe('user', () => {
  const context = getMockContext();
  const mockUsers = [{ email: 'test1@test.com' }, { name: 'test1@test.com' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .post(path, {
        email: 'test1@test.com',
        roles: [endpoint.UserRole.ADMIN],
      })
      .reply(200, response);
    const result = await endpoint.createUser(context, 'test1@test.com', [
      endpoint.UserRole.ADMIN,
    ]);

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should list users', async () => {
    const response = { users: mockUsers };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await endpoint.listUsers(context);

    scope.done();

    expect(result).toEqual(mockUsers);
  });

  it('should get user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl).get(`${path}/id1`).reply(200, response);
    const result = await endpoint.getUser(context, 'id1');

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should update user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        roles: [endpoint.UserRole.USER],
      })
      .reply(200, response);
    const result = await endpoint.updateUser(context, 'id1', undefined, [
      endpoint.UserRole.USER,
    ]);

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should enable user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        status: endpoint.UserStatus.ACTIVE,
      })
      .reply(200, response);
    const result = await endpoint.enableUser(context, 'id1');

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should disable user', async () => {
    const response = { user: mockUsers[0] };
    const scope = nock(baseUrl)
      .patch(`${path}/id1`, {
        status: endpoint.UserStatus.INACTIVE,
      })
      .reply(200, response);
    const result = await endpoint.disableUser(context, 'id1');

    scope.done();

    expect(result).toEqual(mockUsers[0]);
  });

  it('should delete user', async () => {
    const response = { message: 'deleted' };
    const scope = nock(baseUrl).delete(`${path}/id1`).reply(200, response);
    const result = await endpoint.deleteUser(context, 'id1');

    scope.done();

    expect(result).toEqual(response);
  });
});
