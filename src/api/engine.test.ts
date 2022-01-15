import nock from 'nock';

import * as endpoint from './engine';
import { baseUrl, getMockContext } from './testUtils';

describe('engine', () => {
  const context = getMockContext();
  const mockEngines = [{ name: 'engine-1' }, { name: 'engine-2' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create engine', async () => {
    const response = { compute: mockEngines[0] };
    const scope = nock(baseUrl)
      .put(`/${endpoint.ENDPOINT}`, {
        region: 'us-east',
        size: endpoint.EngineSize.S,
        name: 'test-engine',
      })
      .reply(200, response);
    const result = await endpoint.createEngine(
      context,
      'test-engine',
      endpoint.EngineSize.S,
    );

    scope.done();

    expect(result).toEqual(mockEngines[0]);
  });

  it('should list engines', async () => {
    const response = { computes: mockEngines };
    const scope = nock(baseUrl)
      .get(`/${endpoint.ENDPOINT}`)
      .reply(200, response);
    const result = await endpoint.listEngines(context);

    scope.done();

    expect(result).toEqual(mockEngines);
  });

  it('should list engines with params', async () => {
    const response = { computes: mockEngines };
    const query = {
      id: 'test-id',
      state: [
        endpoint.EngineState.PROVISIONED,
        endpoint.EngineState.PROVISIONING,
      ],
    };
    const scope = nock(baseUrl)
      .get(`/${endpoint.ENDPOINT}`)
      .query(query)
      .reply(200, response);
    const result = await endpoint.listEngines(context, query);

    scope.done();

    expect(result).toEqual(mockEngines);
  });

  it('should get engine', async () => {
    const response = { computes: mockEngines };
    const scope = nock(baseUrl)
      .get(`/${endpoint.ENDPOINT}`)
      .query({ name: 'test-engine' })
      .reply(200, response);
    const result = await endpoint.getEngine(context, 'test-engine');

    scope.done();

    expect(result).toEqual(mockEngines[0]);
  });

  it('should delete engine', async () => {
    const response = { status: { message: 'deleted' } };
    const scope = nock(baseUrl)
      .delete(`/${endpoint.ENDPOINT}`, { name: 'test-engine' })
      .reply(200, response);
    const result = await endpoint.deleteEngine(context, 'test-engine');

    scope.done();

    expect(result).toEqual(response.status);
  });
});
