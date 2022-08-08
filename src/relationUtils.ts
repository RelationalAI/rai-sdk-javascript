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

import { Table, tableFromArrays } from 'apache-arrow';
import { isObject, set } from 'lodash-es';

import { ArrowRelation, Relation } from './api/transaction/types';

type Value = string | boolean | number | BigInt | null;
type Primitive = string | boolean | number | null;

export type PlainRelation<T = Value> = {
  relationId: string;
  columns: T[][];
};

export function getKeys(relPath: string) {
  return relPath.split('/').filter(k => k);
}

export function getRelationId(keys: string[]) {
  return `/${keys.join('/')}`;
}

export function arrowTableToJsonRows(table: Table) {
  return table.toArray().map(arr => (arr ? arr.toJSON() : []));
}

export function arrowTableToArrayRows(table: Table) {
  return table.toArray().map(arr => (arr ? arr.toArray() : []));
}

export function plainToArrow(plainRelations: PlainRelation[]) {
  return plainRelations.map(plainRelation => {
    const { relationId, columns } = plainRelation;
    const plainTable: { [c: string]: Value[] } = {};

    columns.forEach((col, index) => {
      plainTable[`v${index + 1}`] = col;
    });

    const relation: ArrowRelation = {
      relationId,
      table: tableFromArrays(plainTable),
      metadata: { arguments: [] },
    };

    return relation;
  });
}

const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

function checkBigInt(num: BigInt, relId: string) {
  if (num < MIN_SAFE || num > MAX_SAFE) {
    throw new Error(
      `${num} doesn't fit in safe numbers range. Relation ${relId}`,
    );
  }
}

export function arrowToJson(arrowRelations: ArrowRelation[]) {
  return arrowRelations.map(r => {
    const plainRelation: PlainRelation<Primitive> = {
      relationId: r.relationId,
      columns: [],
    };

    for (let i = 0; i < r.table.numCols; i++) {
      const col = r.table.getChildAt(i);

      if (col) {
        const val = col.get(0);

        if (typeof val === 'bigint') {
          const arr: BigInt[] = Array.from(col);

          for (const num of arr) {
            checkBigInt(num, r.relationId);
          }

          plainRelation.columns.push(arr.map(n => Number(n)));
        } else if (isObject(val)) {
          // TODO test when tableFromJSON is released in apache-arrow package
          // https://github.com/apache/arrow/pull/12908
          const jsonStr = JSON.stringify(Array.from(col), (_, value) => {
            if (typeof value === 'bigint') {
              checkBigInt(value, r.relationId);

              return Number(value);
            }

            return value;
          });
          plainRelation.columns.push(JSON.parse(jsonStr));
        } else {
          plainRelation.columns.push(col.toJSON());
        }
      } else {
        plainRelation.columns.push([]);
      }
    }

    return plainRelation;
  });
}

export function arrowToPlain(arrowRelations: ArrowRelation[]) {
  return arrowRelations.map(r => {
    const plainRelation: PlainRelation<Primitive> = {
      relationId: r.relationId,
      columns: [],
    };

    for (let i = 0; i < r.table.numCols; i++) {
      const col = r.table.getChildAt(i);

      plainRelation.columns.push(col ? Array.from(col) : []);
    }

    return plainRelation;
  });
}

function v1ToPlain(v1Relations: Relation[]) {
  return v1Relations.map(r => {
    const keys = [...r.rel_key.keys, ...r.rel_key.values];
    const plainRelation: PlainRelation = {
      relationId: `/${keys.join('/')}`,
      columns: r.columns as Value[][],
    };

    return plainRelation;
  });
}

const SYMBOL_PREFIX = ':';
const ARRAY_MARKER = '[]';
const ARRAY_SYMBOL = SYMBOL_PREFIX + ARRAY_MARKER;
const EMPTY_ARRAY_MARKER = 'Missing';

// toJSON converts Rel relations to JSON object.

// In short, the following relation
// {
//   rel_key: {
//     ...
//     keys: ['String', ':foo', ':[]', 'Int64', ':bar'],
//     values: ['String']
//   },
//   columns: [
//     ['root', 'root'],
//     [1, 2],
//     ['test1', 'test2'],
//   ],
// }

// will be converted to JSON via two lodash.set calls like below:

// const result = {};
// lodash.set(result, ['root', 'foo', 0, 'bar'], 'test1')
// lodash.set(result, ['root', 'foo', 1, 'bar'], 'test2')

// result will be

// {
//   root: {
//     foo: [
//       { bar: 'test1' },
//       { bar: 'test2' }
//     ]
//   }
// }

export function toJson(output: Relation[] | ArrowRelation[]): any {
  if (!output.length) {
    return {};
  }

  let relations: PlainRelation[] = [];

  if ('rel_key' in output[0] && 'columns' in output[0]) {
    relations = v1ToPlain(output as Relation[]);
  } else if ('relationId' in output[0] && 'table' in output[0]) {
    relations = arrowToJson(output as ArrowRelation[]);
  } else {
    throw new Error('Unknown relation format');
  }

  relations = relations.filter(r => getKeys(r.relationId).length);

  // scalar value shortcut
  if (
    relations.length === 1 &&
    getKeys(relations[0].relationId)[0][0] !== SYMBOL_PREFIX
  ) {
    return relations[0].columns[0][0];
  }

  const rootArrayNumber = relations.reduce((memo, relation) => {
    const keys = getKeys(relation.relationId);

    if (keys[0] === ARRAY_SYMBOL) {
      return memo + 1;
    }

    return memo;
  }, 0);

  if (rootArrayNumber > 0 && rootArrayNumber < output.length) {
    throw new Error('toJSON: Inconsistent root array relations.');
  }

  const result = rootArrayNumber === 0 ? {} : [];

  relations.forEach(relation => {
    const keys = getKeys(relation.relationId);

    if (keys.length === 0) {
      return;
    }

    const propPath: (string | number)[] = [];
    const columnLookup: { [s: number]: number } = {};
    let index = 0;

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      if (key[0] === SYMBOL_PREFIX) {
        propPath.push(key.slice(1));
      } else {
        if (keys[i - 1] === ARRAY_SYMBOL) {
          columnLookup[index] = propPath.length - 1;
        } else {
          columnLookup[index] = propPath.length;
          propPath.push(key);
        }

        index++;
      }
    }

    // if the last key is a symbol, then we need to add it to the prop path
    // so we can set the value to an empty object
    if (keys[keys.length - 1][0] === SYMBOL_PREFIX) {
      propPath.push(keys[keys.length - 1].slice(1));
    }

    if (relation.columns.length === 0) {
      set(result, propPath, {});
    } else {
      for (let i = 0; i < relation.columns[0].length; i++) {
        let pathToSet = propPath.slice();
        let value: any;

        for (let j = 0; j < relation.columns.length; j++) {
          const colValue = relation.columns[j][i];
          const pathIndex = columnLookup[j];

          if (pathIndex !== undefined) {
            const isArray = pathToSet[pathIndex] === ARRAY_MARKER;

            if (isArray) {
              const arrayIndex =
                typeof colValue === 'number'
                  ? colValue - 1 // rel indices start from 1, not 0
                  : i; // wow, non-number array index?
              pathToSet[columnLookup[j]] = arrayIndex;
            } else {
              pathToSet[columnLookup[j]] = colValue as string | number;
            }
          } else if (j === relation.columns.length - 1) {
            value = colValue;
          }
        }

        if (
          pathToSet[pathToSet.length - 1] === ARRAY_MARKER &&
          keys[keys.length - 1] === EMPTY_ARRAY_MARKER
        ) {
          pathToSet = pathToSet.slice(0, -1);
          value = [];
        } else if (value === undefined) {
          // present value
          value = {};
        }

        set(result, pathToSet, value);
      }
    }
  });

  return result;
}

export function filterRelations(relations: ArrowRelation[], keys: string[]) {
  const len = keys.length;
  const keysStr = keys.join('/');
  const filteredRelations: ArrowRelation[] = [];

  relations.forEach(r => {
    const relationKeys = getKeys(r.relationId);

    if (relationKeys.slice(0, len).join('/') === keysStr) {
      const newKeys = relationKeys.slice(len);

      filteredRelations.push({
        ...r,
        relationId: getRelationId(newKeys),
      });
    }
  });

  return filteredRelations;
}

export type Pos = {
  line: number;
  character: number;
};

export type Range = {
  start: Pos;
  end: Pos;
};

export type Diagnostic = {
  code: string;
  message: string;
  severity: 'exception' | 'error' | 'warning' | 'info' | 'suggestion';
  report?: string;
  range?: Range[];
  model?: string;
};

export function parseDiagnostics(relations: ArrowRelation[]) {
  relations = filterRelations(relations, [':rel', ':catalog', ':diagnostic']);

  const diagnostics: Diagnostic[] = [];

  setRangeProp(
    ['start', 'line'],
    diagnostics,
    filterRelations(relations, [':range', ':start', ':line'])[0],
  );
  setRangeProp(
    ['start', 'character'],
    diagnostics,
    filterRelations(relations, [':range', ':start', ':character'])[0],
  );
  setRangeProp(
    ['end', 'line'],
    diagnostics,
    filterRelations(relations, [':range', ':end', ':line'])[0],
  );
  setRangeProp(
    ['end', 'character'],
    diagnostics,
    filterRelations(relations, [':range', ':end', ':character'])[0],
  );
  setProp('message', diagnostics, filterRelations(relations, [':message'])[0]);
  setProp(
    'severity',
    diagnostics,
    filterRelations(relations, [':severity'])[0],
  );
  setProp('code', diagnostics, filterRelations(relations, [':code'])[0]);
  setProp('report', diagnostics, filterRelations(relations, [':report'])[0]);
  setProp('model', diagnostics, filterRelations(relations, [':model'])[0]);

  return diagnostics;
}

function setRangeProp(
  path: string[],
  result: Diagnostic[],
  relation: ArrowRelation,
) {
  if (relation) {
    const rows = arrowTableToArrayRows(relation.table);

    rows.forEach(row => {
      const diagnosticIndex = Number(row[0]) - 1;
      const rangeIndex = Number(row[1]) - 1;
      const value = typeof row[2] === 'bigint' ? Number(row[2]) : row[2];

      set(result, [diagnosticIndex, 'range', rangeIndex, ...path], value);
    });
  }
}

function setProp(path: string, result: Diagnostic[], relation: ArrowRelation) {
  if (relation) {
    const rows = arrowTableToArrayRows(relation.table);

    rows.forEach(row => {
      const diagnosticIndex = Number(row[0]) - 1;
      const value = typeof row[1] === 'bigint' ? Number(row[1]) : row[1];

      set(result, [diagnosticIndex, path], value);
    });
  }
}

export function readResults(relations: ArrowRelation[]) {
  return {
    output: filterRelations(relations, [':output']),
    diagnostics: parseDiagnostics(relations),
  };
}
