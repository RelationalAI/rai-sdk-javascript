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

import { convertValue, getDisplayValue, getTypeDef } from './resultUtils';
import { tests } from './testData';

describe('resultUtils', () => {
  describe('getTypeDef', () => {
    tests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(`should get type def for ${test.type} value`, async () => {
        const typeDef = getTypeDef(test.relType);

        expect(test).toEqual(expect.objectContaining(typeDef));
      });
    });
  });

  describe('convertValue', () => {
    tests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(`should convert ${test.type} value`, async () => {
        const values = test.arrowValues.map(val =>
          convertValue(
            {
              type: test.type as any,
              places: test.places,
            },
            val as any,
          ),
        );

        expect(values).toEqual(test.values);
      });
    });
  });

  describe('getDisplayValue', () => {
    tests.forEach(test => {
      const testFn = test.only ? it.only : it;

      testFn(`should display ${test.type} value`, async () => {
        const displayValues = test.values.map(val =>
          getDisplayValue({
            type: test.type as any,
            places: test.places,
            value: val as any,
          }),
        );

        expect(displayValues).toEqual(test.displayValues);
      });
    });
  });
});
