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
import { Table as PrintTable } from 'console-table-printer';

import { ArrowRelation } from '../api/transaction/types';
import { convertValue, getDisplayValue, getTypeDef } from './resultUtils';
import { RelTypeDef, RelTypedValue } from './types';

export interface ResultColumn extends IteratorOf<RelTypedValue['value']> {
  typeDef: RelTypeDef;
}

interface IteratorOf<T> {
  [Symbol.iterator](): IterableIterator<T>;
  values: () => T[];
  length: number;
}

export class ResultTable implements IteratorOf<RelTypedValue['value'][]> {
  private table: Table;
  private typeDefs: RelTypeDef[];

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

    this.typeDefs = columnTypes.map(getTypeDef);
  }

  get columnLength() {
    return this.table.numCols;
  }

  columns() {
    const columns = [];

    for (let i = 0; i < this.columnLength; i++) {
      columns.push(this.columnAt(i));
    }

    return columns;
  }

  columnAt(index: number) {
    const arrowColumn = this.table.getChildAt(index);
    const typeDef = this.typeDefs[index];

    if (!arrowColumn) {
      throw new Error(`Couldn't find column by index`);
    }
    const length = arrowColumn.length;

    const column: ResultColumn = {
      get length() {
        return length;
      },
      get typeDef() {
        return typeDef;
      },
      *[Symbol.iterator]() {
        for (const val of arrowColumn) {
          yield convertValue(typeDef, val);
        }
      },
      values() {
        return Array.from(this);
      },
    };

    return column;
  }

  get length() {
    return this.table.numRows;
  }

  *[Symbol.iterator]() {
    for (const arrowRow of this.table) {
      const row = arrowRow
        .toArray()
        .map((value, index) => convertValue(this.typeDefs[index], value));

      yield row;
    }
  }

  values() {
    return Array.from(this);
  }

  get(index: number) {
    const arrowRow = this.table.get(index);

    this.table.slice();

    if (arrowRow) {
      return arrowRow
        .toArray()
        .map((value, index) => convertValue(this.typeDefs[index], value));
    }
  }

  slice(begin?: number | undefined, end?: number | undefined) {
    const slicedTable = this.table.slice(begin, end);

    return slicedTable.toArray().map(arrowRow => {
      return arrowRow
        .toArray()
        .map((value, index) => convertValue(this.typeDefs[index], value));
    });
  }

  print() {
    const pTable = new PrintTable({
      columns: this.typeDefs.map((typeDef, i) => ({
        name: i.toString(),
        title: typeDef.type,
      })),
    });

    this.values().forEach(row => {
      const printRow: Record<number, string> = {};

      row.forEach((val, index) => {
        const typeDef = this.typeDefs[index];
        printRow[index] = getDisplayValue(typeDef, val);
      });

      pTable.addRow(printRow);
    });

    pTable.printTable();
  }
}
