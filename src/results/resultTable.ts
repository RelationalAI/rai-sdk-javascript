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
import { CellToJsFormat } from './resultCell';
import { ResultColumn, ResultColumnDef } from './resultColumn';
import { ResultRow } from './resultRow';

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

    this.columnDefs = columnTypes.map((type, index) => ({
      id: `column${index}`,
      name: type,
      type,
    }));
  }

  get rowLength() {
    return this.table.numRows;
  }

  get columnLength() {
    return this.table.numCols;
  }

  getRows() {
    const rowArray = Array.from(this.table.toArray());

    return rowArray.map(row => new ResultRow(row, this.columnDefs));
  }

  getColumns() {
    const columns: ResultColumn[] = [];

    for (let i = 0; i < this.table.numCols; i++) {
      const col = this.table.getChild(i);

      if (col) {
        columns.push(new ResultColumn(this.columnDefs[i], col));
      }
    }

    return columns;
  }

  toJS(format: CellToJsFormat = 'value') {
    return this.getRows().map(row => {
      return row.toJS(format);
    });
  }
}
