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
import { set } from 'lodash-es';

import { ArrowRelation, Relation } from './transaction/types';

type Primitive = string | boolean | number | null;

export type PlainRelation = {
  relationId: string;
  columns: Primitive[][];
};

export function getKeys(relPath: string) {
  return relPath.split('/').filter(k => k);
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
    const plainTable: { [c: string]: Primitive[] } = {};

    columns.forEach((col, index) => {
      plainTable[`v${index + 1}`] = col;
    });

    const relation: ArrowRelation = {
      relationId,
      table: tableFromArrays(plainTable),
    };

    return relation;
  });
}

export function arrowToPlain(arrowRelations: ArrowRelation[]) {
  return arrowRelations.map(r => {
    const plainRelation: PlainRelation = {
      relationId: r.relationId,
      columns: [],
    };

    for (let i = 0; i < r.table.numCols; i++) {
      const col = r.table.getChildAt(i);

      plainRelation.columns.push(col?.toJSON() || []);
    }

    return plainRelation;
  });
}

function v1ToPlain(v1Relations: Relation[]) {
  return v1Relations.map(r => {
    const keys = [...r.rel_key.keys, ...r.rel_key.values];
    const plainRelation: PlainRelation = {
      relationId: `/${keys.join('/')}`,
      columns: r.columns as Primitive[][],
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

export function toJson(output: Relation[] | ArrowRelation[]) {
  if (!output.length) {
    return {};
  }

  let relations: PlainRelation[] = [];

  if ('rel_key' in output[0] && 'table' in output[0]) {
    relations = v1ToPlain(output as Relation[]);
  } else if ('relationId' in output[0] && 'table' in output[0]) {
    relations = arrowToPlain(output as ArrowRelation[]);
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
  });

  return result;
}
