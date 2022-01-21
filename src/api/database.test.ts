import nock from 'nock';

import * as endpoint from './database';
import { baseUrl, getMockContext } from './testUtils';

const path = '/database';

describe('database', () => {
  const context = getMockContext();
  const mockDatabases = [{ name: 'database-1' }, { name: 'database-2' }];

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should create database', async () => {
    const response = { database: mockDatabases[0] };
    const scope = nock(baseUrl)
      .put(path, {
        name: 'test-database',
      })
      .reply(200, response);
    const result = await endpoint.createDatabase(context, 'test-database');

    scope.done();

    expect(result).toEqual(mockDatabases[0]);
  });

  it('should list databases', async () => {
    const response = { databases: mockDatabases };
    const scope = nock(baseUrl).get(path).reply(200, response);
    const result = await endpoint.listDatabases(context);

    scope.done();

    expect(result).toEqual(mockDatabases);
  });

  it('should list databases with params', async () => {
    const response = { databases: mockDatabases };
    const query = {
      name: ['n1', 'n2'],
      state: endpoint.DatabaseState.CREATED,
    };
    const scope = nock(baseUrl).get(path).query(query).reply(200, response);
    const result = await endpoint.listDatabases(context, query);

    scope.done();

    expect(result).toEqual(mockDatabases);
  });

  it('should get database', async () => {
    const response = { databases: mockDatabases };
    const scope = nock(baseUrl)
      .get(path)
      .query({ name: 'test-database' })
      .reply(200, response);
    const result = await endpoint.getDatabase(context, 'test-database');

    scope.done();

    expect(result).toEqual(mockDatabases[0]);
  });

  it('should delete database', async () => {
    const response = { message: 'deleted' };
    const scope = nock(baseUrl)
      .delete(path, { name: 'test-database' })
      .reply(200, response);
    const result = await endpoint.deleteDatabase(context, 'test-database');

    scope.done();

    expect(result).toEqual(response);
  });
});
