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

import {
  arrowTableToArrayRows,
  arrowTableToJsonRows,
  arrowToJson,
  arrowToPlain,
  getKeys,
  plainToArrow,
  toJson,
} from './relationUtils';
import { ArrowRelation } from './transaction/types';

describe('relationUtils', () => {
  it('should get keys from relation id', () => {
    expect(getKeys('/Int64')).toEqual(['Int64']);
    expect(getKeys('/:output/:foo/Int64')).toEqual([
      ':output',
      ':foo',
      'Int64',
    ]);
  });

  it('should convert arrow table to json', () => {
    const table = tableFromArrays({
      foo: [1, 2, 3],
      bar: ['a', 'b', 'c'],
    });
    const expectedResult = [
      { foo: 1, bar: 'a' },
      { foo: 2, bar: 'b' },
      { foo: 3, bar: 'c' },
    ];

    expect(arrowTableToJsonRows(table)).toEqual(expectedResult);
  });

  it('should convert arrow table to array', () => {
    const table = tableFromArrays({
      foo: [1, 2, 3],
      bar: ['a', 'b', 'c'],
    });
    const expectedResult = [
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ];

    expect(arrowTableToArrayRows(table)).toEqual(expectedResult);
  });

  it('should convert plain relation to arrow', () => {
    const id = '/:foo/Int64/:bar/String';
    const relations = plainToArrow([
      {
        relationId: id,
        columns: [
          [1, 2],
          ['a', 'b'],
        ],
      },
    ]);

    expect(relations[0].relationId).toEqual(id);
    expect(relations[0].table.schema.names).toEqual(['v1', 'v2']);
    expect(relations[0].table.get(0)?.toJSON()).toEqual({ v1: 1, v2: 'a' });
    expect(relations[0].table.get(1)?.toJSON()).toEqual({ v1: 2, v2: 'b' });
    expect(relations[0].table.numCols).toEqual(2);
    expect(relations[0].table.numRows).toEqual(2);
  });

  it('should convert arrow relation to plain', () => {
    const id = '/:foo/Int64/:bar/String';
    const relations: ArrowRelation[] = [
      {
        relationId: id,
        table: tableFromArrays({
          foo: [1, 2, 3],
          bar: ['a', 'b', 'c'],
          baz: [BigInt(1), BigInt(2), BigInt(3)],
        }),
      },
    ];
    const plainRelations = arrowToPlain(relations);

    expect(plainRelations).toEqual([
      {
        relationId: id,
        columns: [
          Float64Array.from([1, 2, 3]),
          ['a', 'b', 'c'],
          BigInt64Array.from([BigInt(1), BigInt(2), BigInt(3)]),
        ],
      },
    ]);
  });

  it('should convert arrow relation to json', () => {
    const id = '/:foo/Int64/:bar/String';
    const relations: ArrowRelation[] = [
      {
        relationId: id,
        table: tableFromArrays({
          foo: [BigInt(1), BigInt(2), BigInt(3)],
          bar: ['a', 'b', 'c'],
        }),
      },
    ];
    const plainRelations = arrowToJson(relations);

    expect(plainRelations).toEqual([
      {
        relationId: id,
        columns: [
          [1, 2, 3],
          ['a', 'b', 'c'],
        ],
      },
    ]);
  });

  it('should throw an error when converting arrow relation to json and number is outside of safe range', () => {
    const id = '/:foo/Int64/:bar/String';
    const relations: ArrowRelation[] = [
      {
        relationId: id,
        table: tableFromArrays({
          foo: [BigInt(1), BigInt(2), BigInt(Number.MAX_SAFE_INTEGER + 1)],
          bar: ['a', 'b', 'c'],
        }),
      },
    ];

    expect(() => arrowToJson(relations)).toThrowError();
  });

  describe('toJson', () => {
    const jsonScalar = 1;

    const scalarOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/Int64',
        columns: [[jsonScalar]],
      },
    ]);

    const jsonArray = [1, 2, 3];

    const arrayOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:[]/Int64/Int64',
        columns: [[1, 2, 3], jsonArray],
      },
    ]);

    const arrayErrorOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:[]/Int64/Int64',
        columns: [[1, 2, 3], jsonArray],
      },
      {
        relationId: '/:foo/Int64',
        columns: [[1]],
      },
    ]);

    const emptyArrayOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:[]/Missing', columns: [[null]] },
    ]);

    const simpleOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/', columns: [] },
      { relationId: '/:name/String', columns: [['Anton']] },
      { relationId: '/:age/Int64', columns: [[56]] },
    ]);

    const nestedOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:citizenship/:countryName/String',
        columns: [['Switzerland']],
      },
      { relationId: '/:citizenship/:countryCode/String', columns: [['CH']] },
      { relationId: '/:name/String', columns: [['Anton']] },
      { relationId: '/:age/Int64', columns: [[56]] },
    ]);

    const leafArrayOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:citizenship/:countryName/String',
        columns: [['Switzerland']],
      },
      {
        relationId: '/:citizenship/:currencies/:[]/Int64/String',
        columns: [
          [1, 2],
          ['CHF', 'Swiss Frank'],
        ],
      },
      { relationId: '/:citizenship/:countryCode/String', columns: [['CH']] },
      { relationId: '/:name/String', columns: [['Anton']] },
      { relationId: '/:age/Int64', columns: [[56]] },
    ]);

    const rootArrayOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:[]/Int64/:a/Int64', columns: [[1], [1]] },
    ]);

    const onlyArrayOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:[]/Int64/:[]/Int64/Int64', columns: [[1], [2], [3]] },
      { relationId: '/:[]/Int64/Int64', columns: [[2], [4]] },
      {
        relationId: '/:[]/Int64/:[]/Int64/:[]/Int64/Int64',
        columns: [[1], [1], [2], [2]],
      },
      {
        relationId: '/:[]/Int64/:[]/Int64/:[]/Int64/:[]/Int64/Int64',
        columns: [
          [1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1],
          [1, 2, 3, 4, 5, 6],
          [1, 2, 3, 4, 5, 6],
        ],
      },
    ]);

    const mixedArraysOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:[]/Int64/:[]/Int64/Int64', columns: [[1], [2], [3]] },
      {
        relationId: '/:[]/Int64/:[]/Int64/:[]/Int64/Int64',
        columns: [
          [1, 1, 1],
          [1, 1, 1],
          [2, 3, 4],
          [2, 4, 5],
        ],
      },
      { relationId: '/:[]/Int64/:b/Int64', columns: [[2], [2]] },
      {
        relationId: '/:[]/Int64/:[]/Int64/:[]/Int64/:a/Int64',
        columns: [[1], [1], [5], [1]],
      },
      {
        relationId: '/:[]/Int64/:[]/Int64/:[]/Int64/:[]/Int64/Int64',
        columns: [[1], [1], [1], [1], [1]],
      },
    ]);

    const nestedArrayOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:vals/:[]/Int64/:b/Int64',
        columns: [
          [1, 2],
          [2, 2],
        ],
      },
      { relationId: '/:name/String', columns: [['Anton']] },
      { relationId: '/:vals/:[]/Int64/:a/Int64', columns: [[1], [1]] },
      { relationId: '/:age/Int64', columns: [[56]] },
    ]);

    const doublyNestedArrayOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:age/Int64', columns: [[56]] },
      { relationId: '/:name/String', columns: [['Anton']] },
      {
        relationId: '/:vals/:[]/Int64/:b/:[]/Int64/:q/Int64',
        columns: [[1], [2], [3]],
      },
      {
        relationId: '/:vals/:[]/Int64/:b/:[]/Int64/:p/Int64',
        columns: [
          [1, 1, 2],
          [1, 2, 1],
          [1, 2, 2],
        ],
      },
      {
        relationId: '/:vals/:[]/Int64/:a/Int64',
        columns: [
          [1, 2],
          [1, 2],
        ],
      },
    ]);

    const cakeOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:batters/:batter/:[]/Int64/:type/String',
        columns: [
          [1, 2, 3, 4],
          ['Regular', 'Chocolate', 'Blueberry', "Devil's Food"],
        ],
      },
      {
        relationId: '/:topping/:[]/Int64/:id/String',
        columns: [
          [1, 2, 3, 4, 5, 6, 7],
          ['5001', '5002', '5005', '5007', '5006', '5003', '5004'],
        ],
      },
      { relationId: '/:ppu/Float64', columns: [[0.55]] },
      {
        relationId: '/:topping/:[]/Int64/:type/String',
        columns: [
          [1, 2, 3, 4, 5, 6, 7],
          [
            'None',
            'Glazed',
            'Sugar',
            'Powdered Sugar',
            'Chocolate with Sprinkles',
            'Chocolate',
            'Maple',
          ],
        ],
      },
      { relationId: '/:name/String', columns: [['Cake']] },
      {
        relationId: '/:batters/:batter/:[]/Int64/:id/String',
        columns: [
          [1, 2, 3, 4],
          ['1001', '1002', '1003', '1004'],
        ],
      },
      { relationId: '/:id/String', columns: [['0001']] },
      { relationId: '/:type/String', columns: [['donut']] },
    ]);

    const funkyOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:y/:[]/Int64/:[]/Int64/Int64', columns: [[1], [2], [3]] },
      {
        relationId: '/:y/:[]/Int64/:[]/Int64/:[]/Int64/Int64',
        columns: [
          [1, 1, 1],
          [1, 1, 1],
          [2, 3, 4],
          [2, 4, 5],
        ],
      },
      {
        relationId:
          '/:y/:[]/Int64/:[]/Int64/:[]/Int64/:[]/Int64/:q/:p/:[]/Int64/:o/Int64',
        columns: [[1], [1], [1], [1], [3], [4]],
      },
      {
        relationId: '/:q/:[]/Int64/Float64',
        columns: [
          [1, 2, 3, 4],
          [2.1, 1, 2, 3],
        ],
      },
      { relationId: '/:y/:[]/Int64/Int64', columns: [[3], [4]] },
      { relationId: '/:y/:[]/Int64/:b/Int64', columns: [[2], [2]] },
      { relationId: '/:p/String', columns: [['hello']] },
      {
        relationId: '/:y/:[]/Int64/:[]/Int64/:[]/Int64/:a/Int64',
        columns: [[1], [1], [5], [1]],
      },
      {
        relationId:
          '/:y/:[]/Int64/:[]/Int64/:[]/Int64/:[]/Int64/:q/:p/:[]/Int64/Int64',
        columns: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 2],
          [1, 2],
        ],
      },
    ]);

    const noKeyArrayOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:a/:[]/Int64/:b/String', columns: [['a', 'b', 'c']] },
    ]);

    const nonComparableOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:a/:[]/Int64/:b/Int64',
        columns: [
          ['a', 'b', 'c'],
          [1, 2, 3],
        ],
      },
      {
        relationId: '/:a/:[]/Int64/:c/Int64',
        columns: [
          [1, 2, 3],
          [1, 2, 3],
        ],
      },
    ]);

    const updateContainerExceptionOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:b/:[]/Int64/:c/Int64', columns: [[1], [1]] },
      {
        relationId: '/:a/:[]/Int64/:d/Int64',
        columns: [
          [1, 2],
          [2, 3],
        ],
      },
      { relationId: '/:b/:[]/Int64/:[]/Int64/Int64', columns: [[1], [1], [2]] },
    ]);

    const multipleIteratorsSamePathOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:b/:[]/Int64/String', columns: [[1], ['test']] },
      { relationId: '/:b/:[]/Int64/Float64', columns: [[3], [1.2]] },
      { relationId: '/:b/:[]/Int64/Int64', columns: [[2], [2]] },
    ]);

    const trueOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:[]/Int64/:[]/Int64/:a/Int64', columns: [[1], [1]] },
    ]);

    const stringKeyOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:a/:[]/String/:b/Int64',
        columns: [
          ['first', 'second'],
          [1, 2],
        ],
      },
    ]);

    const emptyIteratorOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:metadata/:notebookFormatVersion/String',
        columns: [['0.0.1']],
      },
      { relationId: '/:cells/:[]/Int64/:source/String', columns: [[], []] },
      {
        relationId: '/:cells/:[]/Int64/:id/String',
        columns: [[1], ['1527e46a-3188-4020-8096-6f766c5e1f2c']],
      },
      { relationId: '/:cells/:[]/Int64/:isCodeFolded/Bool', columns: [[], []] },
      {
        relationId: '/:cells/:[]/Int64/:type/String',
        columns: [[1], ['query']],
      },
      { relationId: '/:cells/:[]/Int64/:name/String', columns: [[], []] },
    ]);

    const notStrictlyIncreasingKeysOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:cells/:[]/Int64/:source/String',
        columns: [
          [1, 2],
          ['def output = foo123', 'def output = concat[file1, file2]'],
        ],
      },
      {
        relationId: '/:cells/:[]/Int64/:inputs/:[]/Int64/:relation/String',
        columns: [
          [1, 2, 2],
          [1, 1, 2],
          ['foo123', 'file1', 'file2'],
        ],
      },
      {
        relationId: '/:metadata/:notebookFormatVersion/String',
        columns: [['0.0.1']],
      },
      {
        relationId: '/:cells/:[]/Int64/:id/String',
        columns: [
          [1, 2],
          [
            '4cff5a1a-9d88-4896-a3c9-ce10e2467f2b',
            'c7715b8c-730f-4480-87c8-f373deb2b5f4',
          ],
        ],
      },
      {
        relationId: '/:cells/:[]/Int64/:type/String',
        columns: [
          [1, 2],
          ['query', 'query'],
        ],
      },
    ]);

    const vegaTooltipOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:marks/:[]/Int64/:type/String',
        columns: [
          [1, 2],
          ['rect', 'text'],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:from/:data/String',
        columns: [[1], ['table']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:fill/:value/String',
        columns: [[2], ['#333']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:y/:offset/Int64',
        columns: [[2], [-2]],
      },
      {
        relationId: '/:scales/:[]/Int64/:name/String',
        columns: [
          [1, 2],
          ['xscale', 'yscale'],
        ],
      },
      {
        relationId: '/:data/:[]/Int64/:values/:[]/Int64/:amount/Int64',
        columns: [
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 3, 4, 5, 6, 7, 8],
          [28, 55, 43, 91, 81, 53, 19, 87],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:x/:band/Float64',
        columns: [[2], [0.5]],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:text/:signal/String',
        columns: [[2], ['tooltip.amount']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:fill/:value/String',
        columns: [[1], ['steelblue']],
      },
      { relationId: '/:scales/:[]/Int64/:nice/Bool', columns: [[2], [true]] },
      {
        relationId:
          '/:marks/:[]/Int64/:encode/:update/:fillOpacity/:[]/Int64/:value/Int64',
        columns: [
          [2, 2],
          [1, 2],
          [0, 1],
        ],
      },
      {
        relationId: '/:signals/:[]/Int64/:name/String',
        columns: [[1], ['tooltip']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:x/:scale/String',
        columns: [[2], ['xscale']],
      },
      {
        relationId: '/:scales/:[]/Int64/:padding/Float64',
        columns: [[1], [0.05]],
      },
      {
        relationId: '/:scales/:[]/Int64/:range/String',
        columns: [
          [1, 2],
          ['width', 'height'],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:y/:field/String',
        columns: [[1], ['amount']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:y/:scale/String',
        columns: [[2], ['yscale']],
      },
      { relationId: '/:scales/:[]/Int64/:round/Bool', columns: [[1], [true]] },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:x/:field/String',
        columns: [[1], ['category']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:width/:band/Int64',
        columns: [[1], [1]],
      },
      { relationId: '/:padding/Int64', columns: [[5]] },
      { relationId: '/:height/Int64', columns: [[200]] },
      {
        relationId: '/:signals/:[]/Int64/:on/:[]/Int64/:events/String',
        columns: [
          [1, 1],
          [1, 2],
          ['rect:mouseover', 'rect:mouseout'],
        ],
      },
      {
        relationId: '/:scales/:[]/Int64/:domain/:data/String',
        columns: [
          [1, 2],
          ['table', 'table'],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:y2/:value/Int64',
        columns: [[1], [0]],
      },
      {
        relationId: '/:data/:[]/Int64/:name/String',
        columns: [[1], ['table']],
      },
      { relationId: '/:width/Int64', columns: [[400]] },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:width/:scale/String',
        columns: [[1], ['xscale']],
      },
      {
        relationId: '/:axes/:[]/Int64/:orient/String',
        columns: [
          [1, 2],
          ['bottom', 'left'],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:y/:scale/String',
        columns: [[1], ['yscale']],
      },
      {
        relationId: '/:description/String',
        columns: [
          [
            'A basic bar chart example, with value labels shown upon mouse hover.',
          ],
        ],
      },
      {
        relationId: '/:axes/:[]/Int64/:scale/String',
        columns: [
          [1, 2],
          ['xscale', 'yscale'],
        ],
      },
      {
        relationId: '/:data/:[]/Int64/:values/:[]/Int64/:category/String',
        columns: [
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 3, 4, 5, 6, 7, 8],
          ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        ],
      },
      {
        relationId: '/:$schema/String',
        columns: [['https://vega.github.io/schema/vega/v5.json']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:baseline/:value/String',
        columns: [[2], ['bottom']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:hover/:fill/:value/String',
        columns: [[1], ['red']],
      },
      {
        relationId: '/:scales/:[]/Int64/:domain/:field/String',
        columns: [
          [1, 2],
          ['category', 'amount'],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:y/:signal/String',
        columns: [[2], ['tooltip.amount']],
      },
      {
        relationId: '/:scales/:[]/Int64/:type/String',
        columns: [[1], ['band']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:x/:scale/String',
        columns: [[1], ['xscale']],
      },
      { relationId: '/:signals/:[]/Int64/:value/String', columns: [[1]] },
      {
        relationId: '/:marks/:[]/Int64/:encode/:update/:x/:signal/String',
        columns: [[2], ['tooltip.category']],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:align/:value/String',
        columns: [[2], ['center']],
      },
      {
        relationId:
          '/:marks/:[]/Int64/:encode/:update/:fillOpacity/:[]/Int64/:test/String',
        columns: [[2], [1], ['datum === tooltip']],
      },
      {
        relationId: '/:signals/:[]/Int64/:on/:[]/Int64/:update/String',
        columns: [
          [1, 1],
          [1, 2],
          ['datum', '{}'],
        ],
      },
      {
        relationId: '/:marks/:[]/Int64/:encode/:enter/:y2/:scale/String',
        columns: [[1], ['yscale']],
      },
    ]);

    const fileInputOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:metadata/:notebookFormatVersion/String',
        columns: [['0.0.1']],
      },
      {
        relationId: '/:cells/:[]/Int64/:source/String',
        columns: [
          [1, 2, 3],
          [
            'def output = "first cell"',
            'def output = 123',
            'def config:data = mystring\ndef output = load_csv[config]',
          ],
        ],
      },
      {
        relationId: '/:cells/:[]/Int64/:inputs/:[]/Int64/:relation/String',
        columns: [[3], [1], ['mystring']],
      },
      {
        relationId: '/:cells/:[]/Int64/:id/String',
        columns: [
          [1, 2, 3],
          [
            '300323b1-46e8-4998-8ebc-afc42ada2074',
            '4d49de34-6d5a-40ae-9efe-fa031d9d4521',
            'f08f5510-e806-4635-9112-38938667af0b',
          ],
        ],
      },
      {
        relationId: '/:cells/:[]/Int64/:type/String',
        columns: [
          [1, 2, 3],
          ['query', 'query', 'query'],
        ],
      },
      {
        relationId: '/:cells/:[]/Int64/:inputs/:[]/Missing',
        columns: [
          [1, 2],
          [null, null],
        ],
      },
    ]);

    const missingOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:cells/:[]/Int64/:inputs/:[]/Missing',
        columns: [
          [1, 2, 3, 4, 5, 6],
          [null, null, null, null, null, null],
        ],
      },
    ]);

    const sparseArrayOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:root/:[]/Int64/:a/Int64',
        columns: [
          [2, 5],
          [1, 2],
        ],
      },
      {
        relationId: '/:root/:[]/Int64/Missing',
        columns: [
          [1, 3, 4],
          [null, null, null],
        ],
      },
    ]);

    const arrayLikePropStringOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:foo/:[]/String', columns: [['oops']] },
      { relationId: '/:foo/:bar/Int64', columns: [[123]] },
    ]);

    const arrayLikePropIntOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:foo/:bar/Int64', columns: [[123]] },
      { relationId: '/:foo/:[]/Int64', columns: [[321]] },
    ]);

    const arrayLikePropObjectOutput: ArrowRelation[] = plainToArrow([
      { relationId: '/:foo/:[]/:baz/Int64', columns: [[321]] },
      { relationId: '/:foo/:bar/Int64', columns: [[123]] },
    ]);

    const arrayLikePropArrayOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/:foo/:[]/:[]/Int64/:a/Int64',
        columns: [
          [1, 2],
          [1, 2],
        ],
      },
      { relationId: '/:foo/:bar/Int64', columns: [[123]] },
    ]);

    const rootPropOutput: ArrowRelation[] = plainToArrow([
      {
        relationId: '/String/:cells/:[]/Int64/:name/String',
        columns: [
          ['nb1', 'nb2'],
          [2, 2],
          ['', 'nb2-source-1'],
        ],
      },
      {
        relationId: '/String/:cells/:[]/Int64/:type/String',
        columns: [
          ['nb1', 'nb1', 'nb2', 'nb2'],
          [1, 2, 1, 2],
          ['query', 'query', 'markdown', 'install'],
        ],
      },
      {
        relationId: '/String/:cells/:[]/Int64/:id/String',
        columns: [
          ['nb1', 'nb1', 'nb2', 'nb2'],
          [1, 2, 1, 2],
          [
            '2405ee24-4c5e-4ccd-a7c5-592a2f023a14',
            '148dc8d7-83ed-47df-8ff1-50777ab94dbf',
            '0bffff57-2eb1-4956-8d45-50d34ad8fb58',
            '0a2dbad4-6365-483e-abb5-2c5d7d99374c',
          ],
        ],
      },
      {
        relationId: '/String/:cells/:[]/Int64/:source/String',
        columns: [
          ['nb1', 'nb1', 'nb2', 'nb2'],
          [1, 2, 1, 2],
          [
            'def output = "hello, nb1 q1"',
            'def output = concat["nb1 q2", input_file]',
            '### NB2 Cell1',
            '',
          ],
        ],
      },
      {
        relationId:
          '/String/:cells/:[]/Int64/:inputs/:[]/Int64/:relation/String',
        columns: [['nb1'], [2], [1], ['input_file']],
      },
      {
        relationId: '/String/:cells/:[]/Int64/:inputs/:[]/Missing',
        columns: [
          ['nb1', 'nb2', 'nb2'],
          [1, 1, 2],
          [null, null, null],
        ],
      },
      {
        relationId: '/String/:metadata/:notebookFormatVersion/String',
        columns: [
          ['nb1', 'nb2'],
          ['0.0.1', '0.0.1'],
        ],
      },
    ]);

    it('should handle empty inputs', () => {
      const json = toJson([]);

      expect(json).toEqual({});
    });

    it('should construct a scalar from scalar output', () => {
      const json = toJson(scalarOutput);

      expect(json).toEqual(jsonScalar);
    });

    it('should construct an array from relational output', () => {
      const json = toJson(arrayOutput);

      expect(json).toEqual(jsonArray);
    });

    it('should handle an empty array', () => {
      const json = toJson(emptyArrayOutput);

      expect(json).toEqual([]);
    });

    it('should handle inconsistent array', () => {
      expect(() => {
        toJson(arrayErrorOutput);
      }).toThrowError();
    });

    it('should construct a simple JSON object from relational output', () => {
      const json = toJson(simpleOutput);

      expect(json).toEqual({ name: 'Anton', age: 56 });
    });

    it('should construct a nested JSON object from relational output', () => {
      const json = toJson(nestedOutput);

      expect(json).toEqual({
        name: 'Anton',
        age: 56,
        citizenship: { countryName: 'Switzerland', countryCode: 'CH' },
      });
    });

    it('should construct a nested JSON object with array leaf node from relational output', () => {
      const json = toJson(leafArrayOutput);

      expect(json).toEqual({
        name: 'Anton',
        age: 56,
        citizenship: {
          countryName: 'Switzerland',
          countryCode: 'CH',
          currencies: ['CHF', 'Swiss Frank'],
        },
      });
    });

    it('should construct JSON with an array root node from relational output', () => {
      const json = toJson(rootArrayOutput);

      expect(json).toEqual([{ a: 1 }]);
    });

    it('should construct JSON with only array nodes from relational output', () => {
      const json = toJson(onlyArrayOutput);

      expect(json).toEqual([[[[1, 2, 3, 4, 5, 6], 2], 3], 4]);
    });

    it('should construct JSON with mixed array and object nodes from relational output', () => {
      const json = toJson(mixedArraysOutput);

      expect(json).toEqual([[[[1], 2, 4, 5, { a: 1 }], 3], { b: 2 }]);
    });

    it('should construct a nested JSON object with an array as a nested node from relational output', () => {
      const json = toJson(nestedArrayOutput);

      expect(json).toEqual({
        name: 'Anton',
        age: 56,
        vals: [{ a: 1, b: 2 }, { b: 2 }],
      });
    });

    it('should construct a nested JSON object with doubly nested array nodes from relational output', () => {
      const json = toJson(doublyNestedArrayOutput);

      expect(json).toEqual({
        name: 'Anton',
        age: 56,
        vals: [
          { a: 1, b: [{ p: 1 }, { p: 2, q: 3 }] },
          { a: 2, b: [{ p: 2 }] },
        ],
      });
    });

    it('should construct a cake recipe from relational output', () => {
      const json = toJson(cakeOutput);

      expect(json).toEqual({
        id: '0001',
        type: 'donut',
        name: 'Cake',
        ppu: 0.55,
        batters: {
          batter: [
            { id: '1001', type: 'Regular' },
            { id: '1002', type: 'Chocolate' },
            { id: '1003', type: 'Blueberry' },
            { id: '1004', type: "Devil's Food" },
          ],
        },
        topping: [
          { id: '5001', type: 'None' },
          { id: '5002', type: 'Glazed' },
          { id: '5005', type: 'Sugar' },
          { id: '5007', type: 'Powdered Sugar' },
          { id: '5006', type: 'Chocolate with Sprinkles' },
          { id: '5003', type: 'Chocolate' },
          { id: '5004', type: 'Maple' },
        ],
      });
    });

    it('should construct funky JSON from relational output', () => {
      const json = toJson(funkyOutput);

      expect(json).toEqual({
        y: [
          [[[{ q: { p: [1, 2, { o: 4 }] } }], 2, 4, 5, { a: 1 }], 3],
          { b: 2 },
          4,
        ],
        p: 'hello',
        q: [2.1, 1, 2, 3],
      });
    });

    it('should produce vega spec with tooltip', () => {
      const json = toJson(vegaTooltipOutput);

      expect(json).toEqual({
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description:
          'A basic bar chart example, with value labels shown upon mouse hover.',
        width: 400,
        height: 200,
        padding: 5,

        data: [
          {
            name: 'table',
            values: [
              { category: 'A', amount: 28 },
              { category: 'B', amount: 55 },
              { category: 'C', amount: 43 },
              { category: 'D', amount: 91 },
              { category: 'E', amount: 81 },
              { category: 'F', amount: 53 },
              { category: 'G', amount: 19 },
              { category: 'H', amount: 87 },
            ],
          },
        ],

        signals: [
          {
            name: 'tooltip',
            value: {},
            on: [
              { events: 'rect:mouseover', update: 'datum' },
              { events: 'rect:mouseout', update: '{}' },
            ],
          },
        ],

        scales: [
          {
            name: 'xscale',
            type: 'band',
            domain: { data: 'table', field: 'category' },
            range: 'width',
            padding: 0.05,
            round: true,
          },
          {
            name: 'yscale',
            domain: { data: 'table', field: 'amount' },
            nice: true,
            range: 'height',
          },
        ],

        axes: [
          { orient: 'bottom', scale: 'xscale' },
          { orient: 'left', scale: 'yscale' },
        ],

        marks: [
          {
            type: 'rect',
            from: { data: 'table' },
            encode: {
              enter: {
                x: { scale: 'xscale', field: 'category' },
                width: { scale: 'xscale', band: 1 },
                y: { scale: 'yscale', field: 'amount' },
                y2: { scale: 'yscale', value: 0 },
              },
              update: {
                fill: { value: 'steelblue' },
              },
              hover: {
                fill: { value: 'red' },
              },
            },
          },
          {
            type: 'text',
            encode: {
              enter: {
                align: { value: 'center' },
                baseline: { value: 'bottom' },
                fill: { value: '#333' },
              },
              update: {
                x: { scale: 'xscale', signal: 'tooltip.category', band: 0.5 },
                y: { scale: 'yscale', signal: 'tooltip.amount', offset: -2 },
                text: { signal: 'tooltip.amount' },
                fillOpacity: [
                  { test: 'datum === tooltip', value: 0 },
                  { value: 1 },
                ],
              },
            },
          },
        ],
      });
    });

    it('should handle multiple iterators for the same path', () => {
      const json = toJson(multipleIteratorsSamePathOutput);

      expect(json).toEqual({
        b: ['test', 2, 1.2],
      });
    });

    it('should handle not strictly increasing keys at a given offset', () => {
      const json = toJson(notStrictlyIncreasingKeysOutput);

      expect(json).toEqual({
        metadata: { notebookFormatVersion: '0.0.1' },
        cells: [
          {
            source: 'def output = foo123',
            inputs: [{ relation: 'foo123' }],
            id: '4cff5a1a-9d88-4896-a3c9-ce10e2467f2b',
            type: 'query',
          },
          {
            source: 'def output = concat[file1, file2]',
            inputs: [{ relation: 'file1' }, { relation: 'file2' }],
            id: 'c7715b8c-730f-4480-87c8-f373deb2b5f4',
            type: 'query',
          },
        ],
      });
    });

    it('should handle present values', () => {
      const json = toJson(trueOutput);

      expect(json).toEqual([[{ a: {} }]]);
    });

    it('should handle file inputs', () => {
      const json = toJson(fileInputOutput);

      expect(json).toEqual({
        metadata: { notebookFormatVersion: '0.0.1' },
        cells: [
          {
            source: 'def output = "first cell"',
            inputs: [],
            id: '300323b1-46e8-4998-8ebc-afc42ada2074',
            type: 'query',
          },
          {
            source: 'def output = 123',
            inputs: [],
            id: '4d49de34-6d5a-40ae-9efe-fa031d9d4521',
            type: 'query',
          },
          {
            source: 'def config:data = mystring\ndef output = load_csv[config]',
            inputs: [{ relation: 'mystring' }],
            id: 'f08f5510-e806-4635-9112-38938667af0b',
            type: 'query',
          },
        ],
      });
    });

    it('should handle only missing values', () => {
      const json = toJson(missingOutput);

      expect(json).toEqual({
        cells: [
          { inputs: [] },
          { inputs: [] },
          { inputs: [] },
          { inputs: [] },
          { inputs: [] },
          { inputs: [] },
        ],
      });
    });

    it('should handle non-number keys', () => {
      const json = toJson(stringKeyOutput);

      expect(json).toEqual({ a: [{ b: 1 }, { b: 2 }] });
    });

    it('should handle empty tuple for iterators', () => {
      const json = toJson(emptyIteratorOutput);

      expect(json).toEqual({
        metadata: { notebookFormatVersion: '0.0.1' },
        cells: [{ id: '1527e46a-3188-4020-8096-6f766c5e1f2c', type: 'query' }],
      });
    });

    it('should handle sparse arrays', () => {
      const json = toJson(sparseArrayOutput);

      expect(json).toEqual({ root: [null, { a: 1 }, null, null, { a: 2 }] });
    });

    it('should construct array output with missing value column', () => {
      const json = toJson(noKeyArrayOutput);

      expect(json).toEqual({ a: [{ b: {} }, { b: {} }, { b: {} }] });
    });

    it('should construct array output with non-comparable key columns', () => {
      const json = toJson(nonComparableOutput);

      expect(json).toEqual({
        a: [
          { b: 1, c: 1 },
          { b: 2, c: 2 },
          { b: 3, c: 3 },
        ],
      });
    });

    it('should handle invalid container change', () => {
      const json = toJson(updateContainerExceptionOutput);

      expect(json).toEqual({
        a: [{ d: 2 }, { d: 3 }],
        b: [{ '0': 2, c: 1 }],
      });
    });

    it('should handle array like prop string', () => {
      const json = toJson(arrayLikePropStringOutput);

      expect(json).toEqual({
        foo: {
          bar: 123,
          '[]': 'oops',
        },
      });
    });

    it('should handle array like prop int', () => {
      const json = toJson(arrayLikePropIntOutput);

      expect(json).toEqual({
        foo: {
          bar: 123,
          '[]': 321,
        },
      });
    });

    it('should handle array like prop object', () => {
      const json = toJson(arrayLikePropObjectOutput);

      expect(json).toEqual({
        foo: {
          bar: 123,
          '[]': {
            baz: 321,
          },
        },
      });
    });

    it('should handle array like prop object', () => {
      const json = toJson(arrayLikePropArrayOutput);

      expect(json).toEqual({
        foo: {
          bar: 123,
          '[]': [{ a: 1 }, { a: 2 }],
        },
      });
    });

    it('should handle root prop', () => {
      const json = toJson(rootPropOutput);

      expect(json).toEqual({
        nb1: {
          metadata: {
            notebookFormatVersion: '0.0.1',
          },
          cells: [
            {
              id: '2405ee24-4c5e-4ccd-a7c5-592a2f023a14',
              type: 'query',
              source: 'def output = "hello, nb1 q1"',
              inputs: [],
            },
            {
              id: '148dc8d7-83ed-47df-8ff1-50777ab94dbf',
              type: 'query',
              source: 'def output = concat["nb1 q2", input_file]',
              inputs: [{ relation: 'input_file' }],
              name: '',
            },
          ],
        },
        nb2: {
          metadata: {
            notebookFormatVersion: '0.0.1',
          },
          cells: [
            {
              id: '0bffff57-2eb1-4956-8d45-50d34ad8fb58',
              type: 'markdown',
              source: '### NB2 Cell1',
              inputs: [],
            },
            {
              id: '0a2dbad4-6365-483e-abb5-2c5d7d99374c',
              type: 'install',
              source: '',
              inputs: [],
              name: 'nb2-source-1',
            },
          ],
        },
      });
    });
  });
});
