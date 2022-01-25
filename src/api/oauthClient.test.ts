import nock from 'nock';

import * as endpoint from './oauthClient';
import { baseUrl, getMockContext } from './testUtils';

const path = '/oauth-clients';

describe('oauth client', () => {
  const context = getMockContext();
  const mockClients = [{ name: 'client1' }, { name: 'client2' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create oauth client', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl)
      .post(path, {
        name: 'client1',
        permissions: [
          endpoint.Permission.CREATE_COMPUTE,
          endpoint.Permission.CREATE_USER,
        ],
      })
      .reply(200, response);
    const result = await endpoint.createOAuthClient(context, 'client1', [
      endpoint.Permission.CREATE_COMPUTE,
      endpoint.Permission.CREATE_USER,
    ]);

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should list oauth clients', async () => {
    const response = { clients: mockClients };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await endpoint.listOAuthClients(context);

    scope.done();

    expect(result).toEqual(mockClients);
  });

  it('should get oauth client', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl).get(`${path}/id1`).reply(200, response);
    const result = await endpoint.getOAuthClient(context, 'id1');

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should rotate oauth client secret', async () => {
    const response = { client: mockClients[0] };
    const scope = nock(baseUrl)
      .post(`${path}/id1/rotate-secret`)
      .reply(200, response);
    const result = await endpoint.rotateOAuthClientSecret(context, 'id1');

    scope.done();

    expect(result).toEqual(mockClients[0]);
  });

  it('should delete oauth client', async () => {
    const response = { message: 'deleted' };
    const scope = nock(baseUrl).delete(`${path}/id1`).reply(200, response);
    const result = await endpoint.deleteOAuthClient(context, 'id1');

    scope.done();

    expect(result).toEqual(response);
  });
});
