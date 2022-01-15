import nock from 'nock';

import * as endpoint from './engine';
import { baseUrl, getMockContext } from './testUtils';

describe('engine', () => {
  const context = getMockContext();
  const mockEngines = [{ name: 'engine-1' }, { name: 'engine-2' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should return engines', async () => {
    const response = { computes: mockEngines };
    const scope = nock(baseUrl)
      .get(`/${endpoint.ENDPOINT}`)
      .reply(200, response);
    const result = await endpoint.listEngines(context);

    scope.done();

    expect(result).toEqual(mockEngines);
  });

  it('should return engines with params', async () => {
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
});
