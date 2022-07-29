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

export interface ResultColumn {
  /**
   * Returns type definition of the column
   *
   * @returns Type definition.
   */
  typeDef: RelTypeDef;

  /**
   * Returns an iterator over column values.
   *
   * @returns An iterator over column values.
   */
  [Symbol.iterator](): IterableIterator<RelTypedValue['value']>;

  /**
   * Returns column values as an array
   *
   * @returns An array of column values.
   */
  values: () => RelTypedValue['value'][];

  /**
   * Number of values in the column.
   *
   * @returns Number of values.
   */
  readonly length: number;
}

interface IteratorOf<T> {
  [Symbol.iterator](): IterableIterator<T>;
  values: () => T[];
  readonly length: number;
}

/**
 * PhysicalTable provides an interface over {@link ArrowRelation} that maps Rel
 * types to their corresponding JavaScript equivalents.
 */
export class PhysicalTable implements IteratorOf<RelTypedValue['value'][]> {
  private table: Table;
  private typeDefs: RelTypeDef[];

  /**
   * Instantiate a new PhysicalTable instance.
   *
   * @example
   *   cosnt result = await client.exec('database', 'engine', 'def output = 123, "test"')
   *   cosnt table = new PhysicalTable(result.results[0]);
   *
   *   console.log(table.values()); // Prints [[123n, "test"]];
   *
   * @param relation Arrow relation
   */
  constructor(private relation: ArrowRelation) {
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

  /**
   * The number of columns in this table.
   *
   * @returns The number of columns.
   */
  get columnLength() {
    return this.table.numCols;
  }

  /**
   * Return an array of columns.
   *
   * @returns An array of columns.
   */
  columns() {
    const columns = [];

    for (let i = 0; i < this.columnLength; i++) {
      columns.push(this.columnAt(i));
    }

    return columns;
  }

  /**
   * Return column at the given index.
   *
   * @param index The column index.
   * @returns The column, or undefined if the index is out of range.
   */
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

  /**
   * Return a new table containing only specified columns.
   *
   * @param begin The beginning of the specified portion of the Table.
   * @param end The end of the specified portion of the Table. This is
   *   exclusive of the element at the index 'end'.
   * @returns A new PhysicalTable.
   */
  sliceColumns(begin: number | undefined, end?: number | undefined) {
    const relationId = this.typeDefs
      .slice(begin, end)
      .map(td => td.type)
      .join('/');
    const names = this.table.schema.names.slice(begin, end);
    const slicedTable = this.table.select(names);

    return new PhysicalTable({
      relationId: `/${relationId}`,
      table: slicedTable,
    });
  }

  /**
   * The number of rows in this table.
   *
   * @returns The number of rows.
   */
  get length() {
    return this.table.numRows;
  }

  /**
   * Return an iterator over rows.
   *
   * @returns An iterator over rows
   */
  *[Symbol.iterator]() {
    for (const arrowRow of this.table) {
      const row = arrowRow
        .toArray()
        .map((value, index) => convertValue(this.typeDefs[index], value));

      yield row;
    }
  }

  /**
   * Return an array of rows.
   *
   * @returns An array of rows.
   */
  values() {
    return Array.from(this);
  }

  /**
   * Return row at the given index.
   *
   * @param {string} index Row index.
   * @returns The row, or undefined if the index is out of range.
   */
  get(index: number) {
    const arrowRow = this.table.get(index);

    this.table.slice();

    if (arrowRow) {
      return arrowRow
        .toArray()
        .map((value, index) => convertValue(this.typeDefs[index], value));
    }
  }

  /**
   * Return a new table that's a sub-section of this table.
   *
   * @param begin The beginning of the specified portion of the Table.
   * @param end The end of the specified portion of the Table. This is
   *   exclusive of the element at the index 'end'.
   * @returns A new PhysicalTable.
   */
  slice(begin: number | undefined, end?: number | undefined) {
    const slicedTable = this.table.slice(begin, end);

    return new PhysicalTable({
      relationId: this.relation.relationId,
      table: slicedTable,
    });
  }

  /**
   * Prints this table using console.log.
   *
   * Note: it uses getDisplayValue function to convert values to strings.
   */
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
