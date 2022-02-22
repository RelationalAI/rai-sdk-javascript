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

import { toJson } from './toJson';
import { Relation } from './transaction/types';

export const jsonScalar = 1;

export const scalarOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[jsonScalar]],
  },
];

export const jsonArray = [1, 2, 3];

export const arrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1, 2, 3], jsonArray],
  },
];

export const arrayErrorOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1, 2, 3], jsonArray],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1]],
  },
];

export const emptyArrayOutput: Relation[] = [
  {
    rel_key: {
      values: [],
      name: 'output',
      keys: [':[]', 'Missing'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[null]],
  },
];

export const simpleOutput: Relation[] = [
  {
    rel_key: {
      values: [],
      name: 'foo',
      keys: [],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':name', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Anton']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':age', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[56]],
  },
];

export const nestedOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':citizenship', ':countryName', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Switzerland']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':citizenship', ':countryCode', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['CH']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':name', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Anton']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':age', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[56]],
  },
];

export const leafArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':citizenship', ':countryName', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Switzerland']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':citizenship', ':currencies', ':[]', 'Int64', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['CHF', 'Swiss Frank'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':citizenship', ':countryCode', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['CH']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':name', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Anton']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':age', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[56]],
  },
];

export const rootArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':a', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1]],
  },
];

export const onlyArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [2], [3]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[2], [4]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':[]', 'Int64', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1], [2], [2]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        'Int64',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
    ],
  },
];

export const mixedArraysOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [2], [3]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':[]', 'Int64', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 1, 1],
      [1, 1, 1],
      [2, 3, 4],
      [2, 4, 5],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':b', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[2], [2]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':[]', 'Int64', ':[]', 'Int64', ':a', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1], [5], [1]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        'Int64',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1], [1], [1], [1]],
  },
];

export const nestedArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':vals', ':[]', 'Int64', ':b', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      [2, 2],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':name', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Anton']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':vals', ':[]', 'Int64', ':a', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':age', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[56]],
  },
];

export const doublyNestedArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':age', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[56]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':name', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Anton']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':vals', ':[]', 'Int64', ':b', ':[]', 'Int64', ':q', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [2], [3]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':vals', ':[]', 'Int64', ':b', ':[]', 'Int64', ':p', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 1, 2],
      [1, 2, 1],
      [1, 2, 2],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':vals', ':[]', 'Int64', ':a', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      [1, 2],
    ],
  },
];

export const cakeOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':batters', ':batter', ':[]', 'Int64', ':type', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3, 4],
      ['Regular', 'Chocolate', 'Blueberry', "Devil's Food"],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':topping', ':[]', 'Int64', ':id', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3, 4, 5, 6, 7],
      ['5001', '5002', '5005', '5007', '5006', '5003', '5004'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':ppu', 'Float64'],
      values: [],
    },
    type: 'Relation',
    columns: [[0.55]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':topping', ':[]', 'Int64', ':type', 'String'],
      values: [],
    },
    type: 'Relation',
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
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':name', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['Cake']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':batters', ':batter', ':[]', 'Int64', ':id', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3, 4],
      ['1001', '1002', '1003', '1004'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':id', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['0001']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':type', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['donut']],
  },
];

export const funkyOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':y', ':[]', 'Int64', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [2], [3]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':y', ':[]', 'Int64', ':[]', 'Int64', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 1, 1],
      [1, 1, 1],
      [2, 3, 4],
      [2, 4, 5],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':y',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':q',
        ':p',
        ':[]',
        'Int64',
        ':o',
        'Int64',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1], [1], [1], [3], [4]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':q', ':[]', 'Int64', 'Float64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3, 4],
      [2.1, 1, 2, 3],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':y', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[3], [4]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':y', ':[]', 'Int64', ':b', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [[2], [2]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':p', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [['hello']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':y',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':a',
        'Int64',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [[1], [1], [5], [1]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':y',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':[]',
        'Int64',
        ':q',
        ':p',
        ':[]',
        'Int64',
        'Int64',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 2],
      [1, 2],
    ],
  },
];

export const vegaOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':encoding', ':y', ':axis', ':title'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['Max Temperature and Rolling Mean']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':width'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[400]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':encoding', ':y', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['quantitative']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':layer', ':[]', 'Int64', ':encoding', ':y', ':field', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['temp_max', 'rolling_mean'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':encoding', ':x', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['temporal']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':layer', ':[]', 'Int64', ':mark', ':size'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[2], [3]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':height'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[300]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':transform', ':[]', 'Int64', ':window', ':[]', 'Int64', ':as'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], [1], ['rolling_mean']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':data',
        ':values',
        ':[]',
        'DelveTypes.FilePos',
        ':date',
        'Dates.Date',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [
      [50, 86, 120, 153, 187],
      ['2012-01-01', '2012-01-02', '2012-01-03', '2012-01-04', '2012-01-05'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':schema'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['https://vega.github.io/schema/vega-lite/v4.json']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':transform', ':[]', 'Int64', ':window', ':[]', 'Int64', ':op'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], [1], ['mean']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':data',
        ':values',
        ':[]',
        'DelveTypes.FilePos',
        ':temp_max',
        'Float64',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [
      [50, 86, 120, 153, 187],
      [12.8, 10.6, 11.7, 12.2, 8.9],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':encoding', ':x', ':field'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['date']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':encoding', ':x', ':title'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['Date']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':transform', ':[]', 'Int64', ':frame', ':[]', 'Int64', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 1],
      [1, 2],
      [-15, 15],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':transform', ':[]', 'Int64', ':window', ':[]', 'Int64', ':field'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], [1], ['temp_max']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':layer', ':[]', 'Int64', ':encoding', ':y', ':title', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['Max Temperature', 'Rolling Mean of Max Temperature'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':layer', ':[]', 'Int64', ':mark', ':opacity'],
      values: ['Float64'],
    },
    type: 'Relation',
    columns: [[1], [0.3]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':description'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [
        'Plot showing a 30 day rolling average with raw values in the background.',
      ],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':layer', ':[]', 'Int64', ':mark', ':color'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['red']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':layer', ':[]', 'Int64', ':mark', ':type', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['point', 'line'],
    ],
  },
];

export const noKeyArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':a', ':[]', 'Int64', ':b'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['a', 'b', 'c']],
  },
];

export const nonComparableOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':a', ':[]', 'Int64', ':b'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [
      ['a', 'b', 'c'],
      [1, 2, 3],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':a', ':[]', 'Int64', ':c', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3],
      [1, 2, 3],
    ],
  },
];

export const updateContainerExceptionOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':b', ':[]', 'Int64', ':c'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[1], [1]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':a', ':[]', 'Int64', ':d'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      [2, 3],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':b', ':[]', 'Int64', ':[]', 'Int64'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[1], [1], [2]],
  },
];

export const multipleIteratorsSamePathOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':b', ':[]', 'Int64'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['test']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':b', ':[]', 'Int64'],
      values: ['Float64'],
    },
    type: 'Relation',
    columns: [[3], [1.2]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':b', ':[]', 'Int64'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[2], [2]],
  },
];

export const trueOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':[]', 'Int64', ':[]', 'Int64', ':a'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[1], [1]],
  },
];

export const stringKeyOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':a', ':[]', 'String', ':b', 'Int64'],
      values: [],
    },
    type: 'Relation',
    columns: [
      ['first', 'second'],
      [1, 2],
    ],
  },
];

export const emptyIteratorOutput: Relation[] = [
  {
    rel_key: {
      values: ['String'],
      name: 'output',
      keys: [':metadata', ':notebookFormatVersion'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [['0.0.1']],
  },
  {
    rel_key: {
      values: [],
      name: 'output',
      keys: [':cells', ':[]', 'Int64', ':source', 'String'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[], []],
  },
  {
    rel_key: {
      values: ['String'],
      name: 'output',
      keys: [':cells', ':[]', 'Int64', ':id'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[1], ['1527e46a-3188-4020-8096-6f766c5e1f2c']],
  },
  {
    rel_key: {
      values: [],
      name: 'output',
      keys: [':cells', ':[]', 'Int64', ':isCodeFolded', 'Bool'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[], []],
  },
  {
    rel_key: {
      values: ['String'],
      name: 'output',
      keys: [':cells', ':[]', 'Int64', ':type'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[1], ['query']],
  },
  {
    rel_key: {
      values: [],
      name: 'output',
      keys: [':cells', ':[]', 'Int64', ':name', 'String'],
      type: 'RelKey',
    },
    type: 'Relation',
    columns: [[], []],
  },
];

export const notStrictlyIncreasingKeysOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':source', 'String'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['def output = foo123', 'def output = concat[file1, file2]'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':cells',
        ':[]',
        'Int64',
        ':inputs',
        ':[]',
        'Int64',
        ':relation',
        'String',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 2],
      [1, 1, 2],
      ['foo123', 'file1', 'file2'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':metadata', ':notebookFormatVersion'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['0.0.1']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':id'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      [
        '4cff5a1a-9d88-4896-a3c9-ce10e2467f2b',
        'c7715b8c-730f-4480-87c8-f373deb2b5f4',
      ],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['query', 'query'],
    ],
  },
];

export const vegaTooltipOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['rect', 'text'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':from', ':data'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['table']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':fill', ':value'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['#333']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':y', ':offset'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[2], [-2]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':name'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['xscale', 'yscale'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':data', ':[]', 'Int64', ':values', ':[]', 'Int64', ':amount'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 3, 4, 5, 6, 7, 8],
      [28, 55, 43, 91, 81, 53, 19, 87],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':x', ':band'],
      values: ['Float64'],
    },
    type: 'Relation',
    columns: [[2], [0.5]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':marks',
        ':[]',
        'Int64',
        ':encode',
        ':update',
        ':text',
        ':signal',
      ],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['tooltip.amount']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':fill', ':value'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['steelblue']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':nice'],
      values: ['Bool'],
    },
    type: 'Relation',
    columns: [[2], [true]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':marks',
        ':[]',
        'Int64',
        ':encode',
        ':update',
        ':fillOpacity',
        ':[]',
        'Int64',
        ':value',
      ],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [
      [2, 2],
      [1, 2],
      [0, 1],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':signals', ':[]', 'Int64', ':name'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['tooltip']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':x', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['xscale']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':padding'],
      values: ['Float64'],
    },
    type: 'Relation',
    columns: [[1], [0.05]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':range'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['width', 'height'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':y', ':field'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['amount']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':y', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['yscale']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':round'],
      values: ['Bool'],
    },
    type: 'Relation',
    columns: [[1], [true]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':x', ':field'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['category']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':width', ':band'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[1], [1]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':padding'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[5]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':height'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[200]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':signals', ':[]', 'Int64', ':on', ':[]', 'Int64', ':events'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 1],
      [1, 2],
      ['rect:mouseover', 'rect:mouseout'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':domain', ':data'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['table', 'table'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':y2', ':value'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[1], [0]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':data', ':[]', 'Int64', ':name'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['table']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':width'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[400]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':width', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['xscale']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':axes', ':[]', 'Int64', ':orient'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['bottom', 'left'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':y', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['yscale']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':description'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      ['A basic bar chart example, with value labels shown upon mouse hover.'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':axes', ':[]', 'Int64', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['xscale', 'yscale'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':data', ':[]', 'Int64', ':values', ':[]', 'Int64', ':category'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 3, 4, 5, 6, 7, 8],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':$schema'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['https://vega.github.io/schema/vega/v5.json']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':marks',
        ':[]',
        'Int64',
        ':encode',
        ':enter',
        ':baseline',
        ':value',
      ],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['bottom']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':hover', ':fill', ':value'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['red']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':domain', ':field'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      ['category', 'amount'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':y', ':signal'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['tooltip.amount']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':scales', ':[]', 'Int64', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['band']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':x', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['xscale']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':signals', ':[]', 'Int64', ':value'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':update', ':x', ':signal'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['tooltip.category']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':align', ':value'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], ['center']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':marks',
        ':[]',
        'Int64',
        ':encode',
        ':update',
        ':fillOpacity',
        ':[]',
        'Int64',
        ':test',
      ],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[2], [1], ['datum === tooltip']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':signals', ':[]', 'Int64', ':on', ':[]', 'Int64', ':update'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 1],
      [1, 2],
      ['datum', '{}'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':marks', ':[]', 'Int64', ':encode', ':enter', ':y2', ':scale'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [[1], ['yscale']],
  },
];

export const fileInputOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':metadata', ':notebookFormatVersion'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['0.0.1']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':source', 'String'],
      values: [],
    },
    type: 'Relation',
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
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        ':cells',
        ':[]',
        'Int64',
        ':inputs',
        ':[]',
        'Int64',
        ':relation',
        'String',
      ],
      values: [],
    },
    type: 'Relation',
    columns: [[3], [1], ['mystring']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':id'],
      values: ['String'],
    },
    type: 'Relation',
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
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3],
      ['query', 'query', 'query'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':inputs', ':[]', 'Missing'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      [null, null],
    ],
  },
];

export const missingOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':cells', ':[]', 'Int64', ':inputs', ':[]', 'Missing'],
      values: [],
    },
    type: 'Relation',
    columns: [
      [1, 2, 3, 4, 5, 6],
      [null, null, null, null, null, null],
    ],
  },
];

export const sparseArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':root', ':[]', 'Int64', ':a'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [
      [2, 5],
      [1, 2],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':root', ':[]', 'Int64'],
      values: ['Missing'],
    },
    type: 'Relation',
    columns: [
      [1, 3, 4],
      [null, null, null],
    ],
  },
];

export const arrayLikePropStringOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':[]'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['oops']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':bar'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[123]],
  },
];

export const arrayLikePropIntOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':bar'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[123]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':[]'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[321]],
  },
];

export const arrayLikePropObjectOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':[]', ':baz'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[321]],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':bar'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[123]],
  },
];

export const arrayLikePropArrayOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':[]', ':[]', 'Int64', ':a'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [
      [1, 2],
      [1, 2],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [':foo', ':bar'],
      values: ['Int64'],
    },
    type: 'Relation',
    columns: [[123]],
  },
];

export const rootPropOutput: Relation[] = [
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['String', ':cells', ':[]', 'Int64', ':name'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      ['nb1', 'nb2'],
      [2, 2],
      ['', 'nb2-source-1'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['String', ':cells', ':[]', 'Int64', ':type'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      ['nb1', 'nb1', 'nb2', 'nb2'],
      [1, 2, 1, 2],
      ['query', 'query', 'markdown', 'install'],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['String', ':cells', ':[]', 'Int64', ':id'],
      values: ['String'],
    },
    type: 'Relation',
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
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['String', ':cells', ':[]', 'Int64', ':source'],
      values: ['String'],
    },
    type: 'Relation',
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
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: [
        'String',
        ':cells',
        ':[]',
        'Int64',
        ':inputs',
        ':[]',
        'Int64',
        ':relation',
      ],
      values: ['String'],
    },
    type: 'Relation',
    columns: [['nb1'], [2], [1], ['input_file']],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['String', ':cells', ':[]', 'Int64', ':inputs', ':[]'],
      values: ['Missing'],
    },
    type: 'Relation',
    columns: [
      ['nb1', 'nb2', 'nb2'],
      [1, 1, 2],
      [null, null, null],
    ],
  },
  {
    rel_key: {
      name: 'output',
      type: 'RelKey',
      keys: ['String', ':metadata', ':notebookFormatVersion'],
      values: ['String'],
    },
    type: 'Relation',
    columns: [
      ['nb1', 'nb2'],
      ['0.0.1', '0.0.1'],
    ],
  },
];

describe('toJSON', () => {
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
