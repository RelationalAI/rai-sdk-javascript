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
import { readFileSync } from 'fs';

import { ArrowRelation } from '../api/transaction/types';
import { ResultTable } from './resultTable';

const printTableSnapshot = readFileSync(
  __dirname + '/snapshots/printTable.txt',
  'utf-8',
);

describe('ResultTable', () => {
  const relation: ArrowRelation = {
    relationId: '/Int64(1)/:foo/String/:bar/Char/Int64',
    table: tableFromArrays({
      v1: ['w', 'x', 'y', 'z'],
      v2: [97, 98, 99, 100],
      v3: [1n, 2n, 3n, 4n],
    }),
  };
  const specialRelation: ArrowRelation = {
    relationId: '/Int64(1)/:foo',
    table: tableFromArrays({}),
  };

  describe('Default', () => {
    it('should get column length', () => {
      const table = new ResultTable(relation);

      expect(table.columnLength).toEqual(6);
    });

    it('should get columns', () => {
      const table = new ResultTable(relation);
      const columns = table.columns();

      expect(columns.length).toEqual(6);
      expect(columns[0].typeDef).toEqual({
        type: 'Constant',
        name: 'Int64(1)',
        value: 'Int64(1)',
      });
      expect(columns[0].length).toEqual(4);
      expect(columns[1].typeDef).toEqual({
        type: 'Constant',
        name: 'Symbol',
        value: ':foo',
      });
      expect(columns[1].length).toEqual(4);
      expect(columns[2].typeDef).toEqual({ type: 'String' });
      expect(columns[2].length).toEqual(4);
      expect(columns[3].typeDef).toEqual({
        type: 'Constant',
        name: 'Symbol',
        value: ':bar',
      });
      expect(columns[3].length).toEqual(4);
      expect(columns[4].typeDef).toEqual({ type: 'Char' });
      expect(columns[4].length).toEqual(4);
      expect(columns[5].typeDef).toEqual({ type: 'Int64' });
      expect(columns[5].length).toEqual(4);
    });

    it('should get column by index', () => {
      const table = new ResultTable(relation);

      expect(table.columnAt(0).typeDef).toEqual({
        type: 'Constant',
        name: 'Int64(1)',
        value: 'Int64(1)',
      });
      expect(table.columnAt(0).length).toEqual(4);
      expect(table.columnAt(1).typeDef).toEqual({
        type: 'Constant',
        name: 'Symbol',
        value: ':foo',
      });
      expect(table.columnAt(1).length).toEqual(4);
      expect(table.columnAt(2).typeDef).toEqual({ type: 'String' });
      expect(table.columnAt(2).length).toEqual(4);
      expect(table.columnAt(3).typeDef).toEqual({
        type: 'Constant',
        name: 'Symbol',
        value: ':bar',
      });
      expect(table.columnAt(3).length).toEqual(4);
      expect(table.columnAt(4).typeDef).toEqual({ type: 'Char' });
      expect(table.columnAt(4).length).toEqual(4);
      expect(table.columnAt(5).typeDef).toEqual({ type: 'Int64' });
      expect(table.columnAt(5).length).toEqual(4);
    });

    it('should be able to iterate column values', () => {
      const table = new ResultTable(relation);
      const expectedValues = [
        ['Int64(1)', 'Int64(1)', 'Int64(1)', 'Int64(1)'],
        [':foo', ':foo', ':foo', ':foo'],
        ['w', 'x', 'y', 'z'],
        [':bar', ':bar', ':bar', ':bar'],
        ['a', 'b', 'c', 'd'],
        [1n, 2n, 3n, 4n],
      ];

      // eslint-disable-next-line unicorn/no-for-loop
      for (let i = 0; i < expectedValues.length; i++) {
        const column = table.columnAt(i);
        let j = 0;

        for (const val of column) {
          expect(val).toEqual(expectedValues[i][j]);
          j++;
        }
      }
    });

    it('should get column values', () => {
      const table = new ResultTable(relation);
      const expectedValues = [
        ['Int64(1)', 'Int64(1)', 'Int64(1)', 'Int64(1)'],
        [':foo', ':foo', ':foo', ':foo'],
        ['w', 'x', 'y', 'z'],
        [':bar', ':bar', ':bar', ':bar'],
        ['a', 'b', 'c', 'd'],
        [1n, 2n, 3n, 4n],
      ];
      expectedValues.forEach((expectedVals, index) => {
        expect(table.columnAt(index).values()).toEqual(expectedVals);
      });
    });

    it('should handle column operations for fully specialized relation', () => {
      const table = new ResultTable(specialRelation);

      expect(table.columnLength).toEqual(2);

      expect(table.columnAt(0).length).toEqual(1);
      expect(table.columnAt(1).length).toEqual(1);

      expect(table.columnAt(0).values()).toEqual(['Int64(1)']);
      expect(table.columnAt(1).values()).toEqual([':foo']);
    });

    it('should slice columns', () => {
      const table = new ResultTable(relation);

      expect(table.sliceColumns(undefined, 2).values()).toEqual([
        ['Int64(1)', ':foo'],
      ]);
      expect(table.sliceColumns(undefined, 3).values()).toEqual([
        ['Int64(1)', ':foo', 'w'],
        ['Int64(1)', ':foo', 'x'],
        ['Int64(1)', ':foo', 'y'],
        ['Int64(1)', ':foo', 'z'],
      ]);
      expect(table.sliceColumns(4).values()).toEqual([
        ['a', 1n],
        ['b', 2n],
        ['c', 3n],
        ['d', 4n],
      ]);
      expect(table.sliceColumns(2, 4).values()).toEqual([
        ['w', ':bar'],
        ['x', ':bar'],
        ['y', ':bar'],
        ['z', ':bar'],
      ]);
    });

    it('should get length', () => {
      const table = new ResultTable(relation);

      expect(table.length).toEqual(4);
    });

    it('should be able to iterate table values', () => {
      const table = new ResultTable(relation);
      const expectedValues = [
        ['Int64(1)', ':foo', 'w', ':bar', 'a', 1n],
        ['Int64(1)', ':foo', 'x', ':bar', 'b', 2n],
        ['Int64(1)', ':foo', 'y', ':bar', 'c', 3n],
        ['Int64(1)', ':foo', 'z', ':bar', 'd', 4n],
      ];

      let i = 0;

      for (const row of table) {
        expect(row).toEqual(expectedValues[i]);
        i++;
      }
    });

    it('should get table values', () => {
      const table = new ResultTable(relation);
      const expectedValues = [
        ['Int64(1)', ':foo', 'w', ':bar', 'a', 1n],
        ['Int64(1)', ':foo', 'x', ':bar', 'b', 2n],
        ['Int64(1)', ':foo', 'y', ':bar', 'c', 3n],
        ['Int64(1)', ':foo', 'z', ':bar', 'd', 4n],
      ];

      expect(table.values()).toEqual(expectedValues);
    });

    it('should get values by index', () => {
      const table = new ResultTable(relation);

      expect(table.get(2)).toEqual(['Int64(1)', ':foo', 'y', ':bar', 'c', 3n]);
    });

    it('should slice table', () => {
      const table = new ResultTable(relation);

      expect(table.slice(undefined, 2).values()).toEqual([
        ['Int64(1)', ':foo', 'w', ':bar', 'a', 1n],
        ['Int64(1)', ':foo', 'x', ':bar', 'b', 2n],
      ]);
      expect(table.slice(2).values()).toEqual([
        ['Int64(1)', ':foo', 'y', ':bar', 'c', 3n],
        ['Int64(1)', ':foo', 'z', ':bar', 'd', 4n],
      ]);
      expect(table.slice(1, 3).values()).toEqual([
        ['Int64(1)', ':foo', 'x', ':bar', 'b', 2n],
        ['Int64(1)', ':foo', 'y', ':bar', 'c', 3n],
      ]);
    });

    it('should handle value operations for fully specialized relation', () => {
      const table = new ResultTable(specialRelation);

      expect(table.length).toEqual(1);

      expect(table.values()).toEqual([['Int64(1)', ':foo']]);
      expect(table.get(0)).toEqual(['Int64(1)', ':foo']);
    });

    it('should print table', () => {
      const table = new ResultTable(relation);

      jest.spyOn(console, 'log').mockImplementation(() => {});

      table.print();

      // colors are making it hard to read
      // it should looks like
      // ┌──────────┬────────┬────────┬────────┬──────┬───────┐
      // │ Int64(1) │ Symbol │ String │ Symbol │ Char │ Int64 │
      // ├──────────┼────────┼────────┼────────┼──────┼───────┤
      // │ Int64(1) │   :foo │      w │   :bar │    a │     1 │
      // │ Int64(1) │   :foo │      x │   :bar │    b │     2 │
      // │ Int64(1) │   :foo │      y │   :bar │    c │     3 │
      // │ Int64(1) │   :foo │      z │   :bar │    d │     4 │
      // └──────────┴────────┴────────┴────────┴──────┴───────┘

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith(printTableSnapshot);
    });

    it('should get physical table', () => {
      const table = new ResultTable(relation);
      const physicalTable = table.physical();

      expect(physicalTable.values()).toEqual([
        ['w', 'a', 1n],
        ['x', 'b', 2n],
        ['y', 'c', 3n],
        ['z', 'd', 4n],
      ]);
    });

    it('should get arrow table', () => {
      const table = new ResultTable(relation);

      expect(table.arrow()).toBe(relation.table);
    });
  });
});
