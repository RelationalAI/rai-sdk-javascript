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

import { tableFromArrays } from 'apache-arrow';

import { ArrowRelation } from '../api/transaction/types';
import { ResultTable } from './resultTable';

describe('ResultTable', () => {
  const relation: ArrowRelation = {
    relationId: '/Int64(1)/:foo/String/Char/Int64',
    table: tableFromArrays({
      v1: ['w', 'x', 'y', 'z'],
      v2: [97, 98, 99, 100],
      v3: [1n, 2n, 3n, 4n],
    }),
  };

  it('should be able to get column def', () => {
    const resultTable = new ResultTable(relation);

    expect(resultTable.columnDefs).toEqual([
      { typeDef: { type: 'String' } },
      { typeDef: { type: 'Char' } },
      { typeDef: { type: 'Int64' } },
    ]);
  });

  it('should be able to get rows', () => {
    const expectedRows = [
      ['w', 'a', 1n],
      ['x', 'b', 2n],
      ['y', 'c', 3n],
      ['z', 'd', 4n],
    ];
    const resultTable = new ResultTable(relation);

    expect(resultTable.rows.length).toEqual(4);
    expect(resultTable.rows.toArray()).toEqual(expectedRows);

    let i = 0;

    for (const row of resultTable.rows) {
      expect(row).toEqual(expectedRows[i]);
      i++;
    }
  });

  it('should be able to get columns', () => {
    const expectedColumns = [
      ['w', 'x', 'y', 'z'],
      ['a', 'b', 'c', 'd'],
      [1n, 2n, 3n, 4n],
    ];
    const resultTable = new ResultTable(relation);

    expect(resultTable.columns.length).toEqual(3);

    const columns = resultTable.columns.toArray();

    expect(columns[0].columnDef).toEqual({ typeDef: { type: 'String' } });
    expect(columns[0].values.length).toEqual(4);
    expect(columns[0].values.toArray()).toEqual(expectedColumns[0]);

    expect(columns[1].columnDef).toEqual({ typeDef: { type: 'Char' } });
    expect(columns[1].values.length).toEqual(4);
    expect(columns[1].values.toArray()).toEqual(expectedColumns[1]);

    expect(columns[2].columnDef).toEqual({ typeDef: { type: 'Int64' } });
    expect(columns[2].values.length).toEqual(4);
    expect(columns[2].values.toArray()).toEqual(expectedColumns[2]);

    let i = 0;

    for (const column of resultTable.columns) {
      expect(column.values.length).toEqual(4);
      expect(column.values.toArray()).toEqual(expectedColumns[i]);
      i++;
    }

    i = 0;

    for (const value of columns[0].values) {
      expect(value).toEqual(expectedColumns[0][i]);
      i++;
    }
  });
});
