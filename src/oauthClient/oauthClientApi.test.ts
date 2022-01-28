import nock from 'nock';

import { baseUrl, getMockConfig } from '../testUtils';
import { OAuthClientApi } from './oauthClientApi';
import { Permission } from './types';

const path = '/oauth-clients';

describe('OAuthClientApi', () => {
  const api = new OAuthClientApi(getMockConfig());
  const mockClients = [{ name: 'client1' }, { name: 'client2' }];

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
});
