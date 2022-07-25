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

import { Table } from 'apache-arrow';

import { ArrowRelation } from '../api/transaction/types';
import { convertValue, getTypeDef } from './resultUtils';
import { RelTypeDef } from './types';

export type ResultColumnDef = {
  typeDef: RelTypeDef;
};

export type ResultColumn = {
  columnDef: ResultColumnDef;
  values: ResultColumnValues;
};

export type ResultRows = IteratorOf<ReturnType<typeof convertValue>[]>;
export type ResultColumnValues = IteratorOf<ReturnType<typeof convertValue>>;
export type ResultColumns = IteratorOf<ResultColumn>;

type IteratorOf<T> = {
  [Symbol.iterator](): IterableIterator<T>;
  toArray: () => T[];
  length: number;
};

export class ResultTable {
  private table: Table;
  public columnDefs: ResultColumnDef[];

  constructor(relation: ArrowRelation) {
    this.table = relation.table;

    const types = relation.relationId.split('/').filter(x => x);

    // Getting rid of constant types
    // /:bar/String/(:Foo, Int64) -> ["String", "(:Foo, Int64)"]
    // /Int64(1)/Float64 -> ["Float64"]
    const columnTypes = types.filter(type => {
      return (
        !type.startsWith(':') && (!type.includes('(') || type.startsWith('('))
      );
    });

    if (columnTypes.length !== this.table.numCols) {
      throw new Error(`Column number mismatch`);
    }

    this.columnDefs = columnTypes.map(type => ({
      typeDef: getTypeDef(type),
    }));
  }

  get rows() {
    const table = this.table;
    const columnDefs = this.columnDefs;
    const rowsInterator: ResultRows = {
      length: table.numRows,
      toArray: function () {
        return Array.from(this);
      },
      *[Symbol.iterator]() {
        for (const arrowRow of table) {
          const row = arrowRow
            .toArray()
            .map((value, index) =>
              convertValue(columnDefs[index].typeDef, value),
            );

          yield row;
        }
      },
    };

    return rowsInterator;
  }

  get columns() {
    const table = this.table;
    const columnDefs = this.columnDefs;
    const columnsIterator: ResultColumns = {
      length: table.numCols,
      toArray: function () {
        return Array.from(this);
      },
      *[Symbol.iterator]() {
        for (let i = 0; i < table.numCols; i++) {
          const col = table.getChildAt(i);
          const colDef = columnDefs[i];

          if (!col) {
            throw new Error(`Couldn't find result column by index ${i}`);
          }

          const column: ResultColumn = {
            columnDef: colDef,
            values: {
              length: table.numRows,
              toArray: function () {
                return Array.from(this);
              },
              *[Symbol.iterator]() {
                for (const val of col) {
                  yield convertValue(val, colDef.typeDef);
                }
              },
            },
          };

          yield column;
        }
      },
    };

    return columnsIterator;
  }
}
