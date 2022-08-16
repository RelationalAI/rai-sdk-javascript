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

import { StructRowProxy, Table } from 'apache-arrow';
import { Table as PrintTable } from 'console-table-printer';

import { ArrowRelation } from '../api/transaction/types';
import { Kind, PrimitiveType, RelType } from '../proto/generated/schema';
import {
  convertValue,
  getDisplayValue,
  getTypeDef,
  getTypeDefFromProtobuf,
} from './resultUtils';
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
   * Return a value at the given index.
   *
   * @param {string} index Row index.
   * @returns Value or undefined if the index is out of range.
   */
  get: (index: number) => RelTypedValue['value'] | undefined;

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

type ColumnDef = {
  typeDef: RelTypeDef;
  metadata: RelType;
  arrowIndex?: number;
};

/**
 * ResultTable provides an interface over {@link ArrowRelation} that maps Rel
 * types to their corresponding JavaScript equivalents.
 */
export class ResultTable implements IteratorOf<RelTypedValue['value'][]> {
  private table: Table;
  private colDefs: ColumnDef[];

  /**
   * Instantiate a new ResultTable instance.
   *
   * @example
   *   cosnt result = await client.exec('database', 'engine', 'def output = 123, "test"')
   *   cosnt table = new ResultTable(result.results[0]);
   *
   *   console.log(table.values()); // Prints [[123n, "test"]];
   *
   * @param relation Arrow relation
   */
  constructor(private relation: ArrowRelation) {
    this.table = relation.table;

    const isProtoMetadataAvailable = !!relation.metadata.arguments.filter(
      t => t.tag !== Kind.UNSPECIFIED_KIND,
    ).length;
    const types = !isProtoMetadataAvailable
      ? relation.relationId.split('/').filter(x => x)
      : relation.metadata.arguments;

    let arrowIndex = 0;

    this.colDefs = types.map(t => {
      const typeDef =
        typeof t === 'string' ? getTypeDef(t) : getTypeDefFromProtobuf(t);

      const colDef: ColumnDef = {
        typeDef,
        metadata:
          typeof t === 'object'
            ? t
            : // TODO get rid of it when removing JSON metadata based implementation
              {
                tag: Kind.UNSPECIFIED_KIND,
                primitiveType: PrimitiveType.UNSPECIFIED_TYPE,
              },
      };

      if (typeDef.type !== 'Constant') {
        colDef.arrowIndex = arrowIndex;
        arrowIndex++;
      }

      return colDef;
    });
  }

  /**
   * Return an array of type definitions per column. Shortcut for column.typeDef.
   *
   * @returns An array of type definitions.
   */
  typeDefs() {
    return this.colDefs.map(c => c.typeDef);
  }

  /**
   * The number of columns in this table.
   *
   * @returns The number of columns.
   */
  get columnLength() {
    return this.colDefs.length;
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
    const colDef = this.colDefs[index];

    if (!colDef) {
      throw new Error(`Couldn't find column by index`);
    }
    const table = this.table;
    const length = isFullySpecialized(this.colDefs) ? 1 : this.table.numRows;

    const column: ResultColumn = {
      get length() {
        return length;
      },
      get typeDef() {
        return colDef.typeDef;
      },
      *[Symbol.iterator]() {
        if (colDef.typeDef.type === 'Constant') {
          for (let i = 0; i < length; i++) {
            yield convertValue(colDef.typeDef, null);
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const arrowColumn = table.getChildAt(colDef.arrowIndex!);

          if (!arrowColumn) {
            throw new Error(`Couldn't find column by index`);
          }

          for (const val of arrowColumn) {
            yield convertValue(colDef.typeDef, val);
          }
        }
      },
      values() {
        return Array.from(this);
      },
      get(index: number) {
        if (index < 0 || index >= length) {
          return;
        }

        if (colDef.typeDef.type === 'Constant') {
          return convertValue(colDef.typeDef, null);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const arrowColumn = table.getChildAt(colDef.arrowIndex!)!;

          return convertValue(colDef.typeDef, arrowColumn.get(index));
        }
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
   * @returns A new ResultTable.
   */
  sliceColumns(begin: number | undefined, end?: number | undefined) {
    const newColDefs = this.colDefs.slice(begin, end);
    const arrowColNames: any[] = [];

    newColDefs.forEach(colDef => {
      if (colDef.arrowIndex !== undefined) {
        arrowColNames.push(this.table.schema.names[colDef.arrowIndex]);
      }
    });

    const relationId = this.relation.relationId
      .split('/')
      .filter(t => t)
      .slice(begin, end)
      .join('/');
    const slicedTable = this.table.select(arrowColNames);

    return new ResultTable({
      relationId: `/${relationId}`,
      table: slicedTable,
      metadata: { arguments: newColDefs.map(cd => cd.metadata) },
    });
  }

  /**
   * The number of rows in this table.
   *
   * @returns The number of rows.
   */
  get length() {
    if (isFullySpecialized(this.colDefs)) {
      return 1;
    }

    return this.table.numRows;
  }

  /**
   * Return an iterator over rows.
   *
   * @returns An iterator over rows
   */
  *[Symbol.iterator]() {
    if (isFullySpecialized(this.colDefs)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      yield this.get(0)!;
    }

    for (const arrowRow of this.table) {
      yield arrowRowToValues(arrowRow, this.colDefs);
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
   * @returns The row or undefined if the index is out of range.
   */
  get(index: number) {
    if (isFullySpecialized(this.colDefs) && index === 0) {
      return this.colDefs.map(c => {
        return convertValue(c.typeDef, null);
      });
    }

    const arrowRow = this.table.get(index);

    if (arrowRow) {
      return arrowRowToValues(arrowRow, this.colDefs);
    }
  }

  /**
   * Return a new table that's a sub-section of this table.
   *
   * @param begin The beginning of the specified portion of the Table.
   * @param end The end of the specified portion of the Table. This is
   *   exclusive of the element at the index 'end'.
   * @returns A new ResultTable.
   */
  slice(begin: number | undefined, end?: number | undefined) {
    const slicedTable = this.table.slice(begin, end);

    return new ResultTable({
      relationId: this.relation.relationId,
      table: slicedTable,
      metadata: this.relation.metadata,
    });
  }

  /**
   * Prints this table using console.log.
   *
   * Note: it uses getDisplayValue function to convert values to strings.
   */
  print() {
    const pTable = new PrintTable({
      columns: this.colDefs.map((colDef, i) => ({
        name: i.toString(),
        title: colDef.typeDef.name || colDef.typeDef.type,
      })),
    });

    this.values().forEach(row => {
      const printRow: Record<number, string> = {};

      row.forEach((val, index) => {
        const { typeDef } = this.colDefs[index];
        printRow[index] = getDisplayValue(typeDef, val);
      });

      pTable.addRow(printRow);
    });

    pTable.printTable();
  }

  /**
   * Return a new table containing only physical columns. Specialized columns
   * are not included.
   *
   * @returns A new ResultTable.
   */
  physical() {
    const relationId = this.relation.relationId
      .split('/')
      .filter(t => t.length && getTypeDef(t).type !== 'Constant')
      .join('/');

    return new ResultTable({
      relationId: `/${relationId}`,
      table: this.table,
      metadata: {
        arguments: this.colDefs
          .filter(cd => cd.typeDef.type !== 'Constant')
          .map(cd => cd.metadata),
      },
    });
  }

  /**
   * Return Arrow Table that's being used internally
   *
   * @returns Arrow Table
   */
  arrow() {
    return this.table;
  }
}

function arrowRowToValues(arrowRow: StructRowProxy, colDefs: ColumnDef[]) {
  const arr = arrowRow.toArray();
  const row = colDefs.map(colDef => {
    if (colDef.typeDef.type === 'Constant') {
      return convertValue(colDef.typeDef, null);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return convertValue(colDef.typeDef, arr[colDef.arrowIndex!]);
    }
  });

  return row;
}

function isFullySpecialized(colDefs: ColumnDef[]) {
  return colDefs.length && colDefs.every(c => c.typeDef.type === 'Constant');
}
