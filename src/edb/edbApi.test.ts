import nock from 'nock';

import { getMockConfig, nockTransaction } from '../testUtils';
import { RelKey } from '../transaction/types';
import { EdbApi } from './edbApi';

describe('EdbApi', () => {
  const api = new EdbApi(getMockConfig());
  const mockEdbs: RelKey[] = [
    {
      values: ['RAI_VariableSizeStrings.VariableSizeString'],
      name: 'edb1',
      keys: [':region', 'RelationalAITypes.FilePos'],
      type: 'RelKey',
    },
    {
      values: ['RAI_VariableSizeStrings.VariableSizeString'],
      name: 'edb2',
      keys: [':region', 'RelationalAITypes.FilePos'],
      type: 'RelKey',
    },
  ];
  const database = 'test-db';
  const engine = 'test-engine';

  afterEach(() => nock.cleanAll());
  afterAll(() => nock.restore());

  it('should list edbs', async () => {
    const scope = nockTransaction(
      [
        {
          type: 'ListEdbAction',
        },
      ],
      [
        {
          type: 'ListEdbActionResult',
          rels: mockEdbs,
        },
      ],
      database,
      engine,
    );
    const result = await api.listEdbs(database, engine);

    scope.done();

    expect(result).toEqual(mockEdbs);
  });

  it('should delete edb', async () => {
    const scope = nockTransaction(
      [
        {
          type: 'ModifyWorkspaceAction',
          delete_edb: 'edb1',
        },
      ],
      [
        {
          type: 'ModifyWorkspaceActionResult',
          delete_edb_result: [mockEdbs[1]],
        },
      ],
      database,
      engine,
      false,
    );
    const result = await api.deleteEdb(database, engine, 'edb1');

    scope.done();

    expect(result).toEqual([mockEdbs[1]]);
  });
});
