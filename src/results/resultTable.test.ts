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
import { Table as PrintTable } from 'console-table-printer';

import { ArrowRelation } from '../api/transaction/types';
import { MetadataInfo } from '../proto/generated/message';
import { ResultTable } from './resultTable';

function makeMetadata(json: any) {
  const metadata = MetadataInfo.fromJson({
    relations: [{ fileName: '', relationId: json }],
  }).relations[0].relationId;

  if (!metadata) {
    throw new Error('Failed to make metadata');
  }

  return metadata;
}

describe('ResultTable', () => {
  const relation: ArrowRelation = {
    relationId: '/Int64(1)/:foo/String/:bar/Char/Int64',
    table: tableFromArrays({
      v1: ['w', 'x', 'y', 'z'],
      v2: [97, 98, 99, 100],
      v3: [1n, 2n, 3n, 4n],
    }),
    metadata: makeMetadata({
      arguments: [
        {
          tag: 'CONSTANT_TYPE',
          constantType: {
            relType: {
              tag: 'PRIMITIVE_TYPE',
              primitiveType: 'INT_64',
            },
            value: {
              arguments: [
                {
                  tag: 'INT_64',
                  int64Val: '1',
                },
              ],
            },
          },
        },
        {
          tag: 'CONSTANT_TYPE',
          constantType: {
            relType: {
              tag: 'PRIMITIVE_TYPE',
              primitiveType: 'STRING',
            },
            value: {
              arguments: [
                {
                  tag: 'STRING',
                  stringVal: 'Zm9v',
                },
              ],
            },
          },
        },
        {
          tag: 'PRIMITIVE_TYPE',
          primitiveType: 'STRING',
        },
        {
          tag: 'CONSTANT_TYPE',
          constantType: {
            relType: {
              tag: 'PRIMITIVE_TYPE',
              primitiveType: 'STRING',
            },
            value: {
              arguments: [
                {
                  tag: 'STRING',
                  stringVal: 'YmFy',
                },
              ],
            },
          },
        },
        {
          tag: 'PRIMITIVE_TYPE',
          primitiveType: 'CHAR',
        },
        {
          tag: 'PRIMITIVE_TYPE',
          primitiveType: 'INT_64',
        },
      ],
    }),
  };
  const specialRelation: ArrowRelation = {
    relationId: '/Int64(1)/:foo',
    table: tableFromArrays({}),
    metadata: makeMetadata({
      arguments: [
        {
          tag: 'CONSTANT_TYPE',
          constantType: {
            relType: {
              tag: 'PRIMITIVE_TYPE',
              primitiveType: 'INT_64',
            },
            value: {
              arguments: [
                {
                  tag: 'INT_64',
                  int64Val: '1',
                },
              ],
            },
          },
        },
        {
          tag: 'CONSTANT_TYPE',
          constantType: {
            relType: {
              tag: 'PRIMITIVE_TYPE',
              primitiveType: 'STRING',
            },
            value: {
              arguments: [
                {
                  tag: 'STRING',
                  stringVal: 'Zm9v',
                },
              ],
            },
          },
        },
      ],
    }),
  };

  describe('Default', () => {
    it('should type definitions', () => {
      const table = new ResultTable(relation);

      expect(table.typeDefs()).toEqual([
        {
          type: 'Constant',
          value: { type: 'Int64', value: 1n },
        },
        {
          type: 'Constant',
          value: { type: 'String', value: ':foo' },
        },
        { type: 'String' },
        {
          type: 'Constant',
          value: { type: 'String', value: ':bar' },
        },
        { type: 'Char' },
        { type: 'Int64' },
      ]);
    });

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
        value: { type: 'Int64', value: 1n },
      });
      expect(columns[0].length).toEqual(4);
      expect(columns[1].typeDef).toEqual({
        type: 'Constant',
        value: { type: 'String', value: ':foo' },
      });
      expect(columns[1].length).toEqual(4);
      expect(columns[2].typeDef).toEqual({ type: 'String' });
      expect(columns[2].length).toEqual(4);
      expect(columns[3].typeDef).toEqual({
        type: 'Constant',
        value: { type: 'String', value: ':bar' },
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
        value: { type: 'Int64', value: 1n },
      });
      expect(table.columnAt(0).length).toEqual(4);
      expect(table.columnAt(1).typeDef).toEqual({
        type: 'Constant',
        value: { type: 'String', value: ':foo' },
      });
      expect(table.columnAt(1).length).toEqual(4);
      expect(table.columnAt(2).typeDef).toEqual({ type: 'String' });
      expect(table.columnAt(2).length).toEqual(4);
      expect(table.columnAt(3).typeDef).toEqual({
        type: 'Constant',
        value: { type: 'String', value: ':bar' },
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
        [1n, 1n, 1n, 1n],
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
        [1n, 1n, 1n, 1n],
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

    it('should get column value by index', () => {
      const table = new ResultTable(relation);
      const expectedValues = [
        [1n, 1n, 1n, 1n],
        [':foo', ':foo', ':foo', ':foo'],
        ['w', 'x', 'y', 'z'],
        [':bar', ':bar', ':bar', ':bar'],
        ['a', 'b', 'c', 'd'],
        [1n, 2n, 3n, 4n],
      ];
      expectedValues.forEach((expectedVals, index) => {
        expectedVals.forEach((val, valueIndex) => {
          expect(table.columnAt(index).get(valueIndex)).toEqual(val);
        });
      });

      expect(table.columnAt(0).get(-1)).toBeUndefined();
      expect(table.columnAt(0).get(4)).toBeUndefined();
    });

    it('should handle column operations for fully specialized relation', () => {
      const table = new ResultTable(specialRelation);

      expect(table.columnLength).toEqual(2);

      expect(table.columnAt(0).length).toEqual(1);
      expect(table.columnAt(1).length).toEqual(1);

      expect(table.columnAt(0).values()).toEqual([1n]);
      expect(table.columnAt(1).values()).toEqual([':foo']);
      expect(table.columnAt(1).get(0)).toEqual(':foo');
      expect(table.columnAt(1).get(-1)).toBeUndefined();
      expect(table.columnAt(1).get(1)).toBeUndefined();
    });

    it('should slice columns', () => {
      const table = new ResultTable(relation);

      expect(table.sliceColumns(undefined, 2).values()).toEqual([[1n, ':foo']]);
      expect(table.sliceColumns(undefined, 3).values()).toEqual([
        [1n, ':foo', 'w'],
        [1n, ':foo', 'x'],
        [1n, ':foo', 'y'],
        [1n, ':foo', 'z'],
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
        [1n, ':foo', 'w', ':bar', 'a', 1n],
        [1n, ':foo', 'x', ':bar', 'b', 2n],
        [1n, ':foo', 'y', ':bar', 'c', 3n],
        [1n, ':foo', 'z', ':bar', 'd', 4n],
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
        [1n, ':foo', 'w', ':bar', 'a', 1n],
        [1n, ':foo', 'x', ':bar', 'b', 2n],
        [1n, ':foo', 'y', ':bar', 'c', 3n],
        [1n, ':foo', 'z', ':bar', 'd', 4n],
      ];

      expect(table.values()).toEqual(expectedValues);
    });

    it('should get values by index', () => {
      const table = new ResultTable(relation);

      expect(table.get(2)).toEqual([1n, ':foo', 'y', ':bar', 'c', 3n]);
    });

    it('should slice table', () => {
      const table = new ResultTable(relation);

      expect(table.slice(undefined, 2).values()).toEqual([
        [1n, ':foo', 'w', ':bar', 'a', 1n],
        [1n, ':foo', 'x', ':bar', 'b', 2n],
      ]);
      expect(table.slice(2).values()).toEqual([
        [1n, ':foo', 'y', ':bar', 'c', 3n],
        [1n, ':foo', 'z', ':bar', 'd', 4n],
      ]);
      expect(table.slice(1, 3).values()).toEqual([
        [1n, ':foo', 'x', ':bar', 'b', 2n],
        [1n, ':foo', 'y', ':bar', 'c', 3n],
      ]);
    });

    it('should handle value operations for fully specialized relation', () => {
      const table = new ResultTable(specialRelation);

      expect(table.length).toEqual(1);

      expect(table.values()).toEqual([[1n, ':foo']]);
      expect(table.get(0)).toEqual([1n, ':foo']);
    });

    it('should print table', () => {
      const mockOnPrintTable = jest.fn();

      PrintTable.prototype['printTable'] = mockOnPrintTable;

      const table = new ResultTable(relation);

      table.print();

      expect(mockOnPrintTable).toHaveBeenCalled();
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
