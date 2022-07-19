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

import { StructRowProxy } from 'apache-arrow';

import { CellToJsFormat, ResultCell } from './resultCell';
import { ResultColumnDef } from './resultColumn';

export class ResultRow {
  constructor(
    private row: StructRowProxy,
    private columnDefs: ResultColumnDef[],
  ) {}

  getCells() {
    const rowArray = Array.from(this.row.toArray());

    return rowArray.map((cell, index) => {
      return new ResultCell(cell, this.columnDefs[index]);
    });
  }

  toJS(format: CellToJsFormat = 'value') {
    // TODO fix return type
    return this.getCells().reduce<Record<string, any>>((memo, cell) => {
      if (format === 'cell') {
        memo[cell.columnDef.id] = cell;
      } else {
        memo[cell.columnDef.id] = cell[format];
      }

      return memo;
    }, {});
  }
}
