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

  it('should get column length', () => {
    const resultTable = new ResultTable(relation);

    expect(resultTable.columnLength).toEqual(3);
  });

  it('should get columns', () => {
    const resultTable = new ResultTable(relation);
    const columns = resultTable.columns();

    expect(columns.length).toEqual(3);
    expect(columns[0].typeDef).toEqual({ type: 'String' });
    expect(columns[0].length).toEqual(4);
    expect(columns[1].typeDef).toEqual({ type: 'Char' });
    expect(columns[1].length).toEqual(4);
    expect(columns[2].typeDef).toEqual({ type: 'Int64' });
    expect(columns[2].length).toEqual(4);
  });

  it('should get column by index', () => {
    const resultTable = new ResultTable(relation);

    expect(resultTable.columnAt(0).typeDef).toEqual({ type: 'String' });
    expect(resultTable.columnAt(0).length).toEqual(4);
    expect(resultTable.columnAt(1).typeDef).toEqual({ type: 'Char' });
    expect(resultTable.columnAt(1).length).toEqual(4);
    expect(resultTable.columnAt(2).typeDef).toEqual({ type: 'Int64' });
    expect(resultTable.columnAt(2).length).toEqual(4);
  });

  it('should be able to iterate column values', () => {
    const resultTable = new ResultTable(relation);
    const column = resultTable.columnAt(1);
    const expectedValues = ['a', 'b', 'c', 'd'];

    let i = 0;

    for (const val of column) {
      expect(val).toEqual(expectedValues[i]);
      i++;
    }
  });

  it('should get column values', () => {
    const resultTable = new ResultTable(relation);
    const column = resultTable.columnAt(1);

    expect(column.values()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should get length', () => {
    const resultTable = new ResultTable(relation);

    expect(resultTable.length).toEqual(4);
  });

  it('should be able to iterate table values', () => {
    const resultTable = new ResultTable(relation);
    const expectedValues = [
      ['w', 'a', 1n],
      ['x', 'b', 2n],
      ['y', 'c', 3n],
      ['z', 'd', 4n],
    ];

    let i = 0;

    for (const row of resultTable) {
      expect(row).toEqual(expectedValues[i]);
      i++;
    }
  });

  it('should get table values', () => {
    const resultTable = new ResultTable(relation);
    const expectedValues = [
      ['w', 'a', 1n],
      ['x', 'b', 2n],
      ['y', 'c', 3n],
      ['z', 'd', 4n],
    ];

    expect(resultTable.values()).toEqual(expectedValues);
  });

  it('should get values by index', () => {
    const resultTable = new ResultTable(relation);

    expect(resultTable.get(2)).toEqual(['y', 'c', 3n]);
  });

  it('should slice table', () => {
    const resultTable = new ResultTable(relation);

    expect(resultTable.slice(undefined, 2)).toEqual([
      ['w', 'a', 1n],
      ['x', 'b', 2n],
    ]);
    expect(resultTable.slice(2)).toEqual([
      ['y', 'c', 3n],
      ['z', 'd', 4n],
    ]);
    expect(resultTable.slice(1, 3)).toEqual([
      ['x', 'b', 2n],
      ['y', 'c', 3n],
    ]);
  });

  it('should print table', () => {
    const resultTable = new ResultTable(relation);

    jest.spyOn(console, 'log').mockImplementation(() => {});

    resultTable.print();

    // colors are making it hard to read
    // it should looks like
    // ┌────────┬──────┬───────┐
    // │ String │ Char │ Int64 │
    // ├────────┼──────┼───────┤
    // │      w │    a │     1 │
    // │      x │    b │     2 │
    // │      y │    c │     3 │
    // │      z │    d │     4 │
    // └────────┴──────┴───────┘
    const expectedTable = `┌────────┬──────┬───────┐
[37m│[0m[37m [0m[01mString[0m[37m │[0m[37m [0m[01mChar[0m[37m │[0m[37m [0m[01mInt64[0m[37m │[0m
├────────┼──────┼───────┤
[37m│[0m[37m [0m[37m     w[0m[37m │[0m[37m [0m[37m   a[0m[37m │[0m[37m [0m[37m    1[0m[37m │[0m
[37m│[0m[37m [0m[37m     x[0m[37m │[0m[37m [0m[37m   b[0m[37m │[0m[37m [0m[37m    2[0m[37m │[0m
[37m│[0m[37m [0m[37m     y[0m[37m │[0m[37m [0m[37m   c[0m[37m │[0m[37m [0m[37m    3[0m[37m │[0m
[37m│[0m[37m [0m[37m     z[0m[37m │[0m[37m [0m[37m   d[0m[37m │[0m[37m [0m[37m    4[0m[37m │[0m
└────────┴──────┴───────┘`;

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(expectedTable);
  });
});
