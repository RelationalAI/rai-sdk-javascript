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

import { getDisplayName } from './resultUtils';

describe('resultUtils', () => {
  describe('getDisplayName', () => {
    it('should get display name for Int64 type def', () => {
      expect(getDisplayName({ type: 'Int64' })).toEqual('Int64');
    });

    it('should get display name for string constant type def', () => {
      expect(
        getDisplayName({
          type: 'Constant',
          value: { type: 'String', value: ':foo' },
        }),
      ).toEqual('String(:foo)');
    });

    it('should get display name for value type type def', () => {
      expect(
        getDisplayName({
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'Int64',
            },
          ],
        }),
      ).toEqual('(:MyType, Int64)');
    });

    it('should get display name for nested value type type def', () => {
      expect(
        getDisplayName({
          type: 'ValueType',
          typeDefs: [
            {
              type: 'Constant',
              value: { type: 'String', value: ':MyType' },
            },
            {
              type: 'ValueType',
              typeDefs: [
                {
                  type: 'Constant',
                  value: { type: 'String', value: ':InnerType' },
                },
                {
                  type: 'Int64',
                },
                {
                  type: 'String',
                },
              ],
            },
            {
              type: 'Int64',
            },
          ],
        }),
      ).toEqual('(:MyType, (:InnerType, Int64, String), Int64)');
    });
  });
});
