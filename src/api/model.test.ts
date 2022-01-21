import nock from 'nock';

import * as endpoint from './model';
import { getMockContext, nockTransaction } from './testUtils';

describe('model', () => {
  const context = getMockContext();
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
    const result = await endpoint.installModels(
      context,
      database,
      engine,
      mockModels,
    );

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
    const result = await endpoint.listModels(context, database, engine);

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
    const result = await endpoint.getModel(context, database, engine, 'model2');

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
    const result = await endpoint.deleteModel(
      context,
      database,
      engine,
      'model1',
    );

    scope.done();

    expect(result).toEqual({
      type: 'ModifyWorkspaceActionResult',
    });
  });
});
