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

import { Vector } from 'apache-arrow';

import { CellToJsFormat, ResultCell } from './resultCell';

export type ResultColumnDef = {
  id: string;
  name: string;
  type: string;
};

export class ResultColumn {
  constructor(public columnDef: ResultColumnDef, private column: Vector) {}

  getCells() {
    const colArray = Array.from(this.column.toArray());

    return colArray.map((cell: any) => {
      return new ResultCell(cell, this.columnDef);
    });
  }

  toJS(format: CellToJsFormat = 'value') {
    return this.getCells().map(cell => {
      if (format === 'cell') {
        return cell;
      } else {
        return cell[format];
      }
    });
  }
}
