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
import { PrimitiveValue, RelType } from '../proto/generated/schema';
import { RelTypeDef, RelTypedValue } from './types';
export declare function getTypeDef(type: string): RelTypeDef;
export declare function getTypeDefFromProtobuf(type: RelType): RelTypeDef;
export declare function convertValue<T extends RelTypedValue>(typeDef: RelTypeDef, value: any): T['value'];
export declare function getDisplayValue(typeDef: RelTypeDef, value: RelTypedValue['value']): string;
declare function mapPrimitiveValue(val: PrimitiveValue): string | number | bigint | boolean | bigint[];
declare type PValue = ReturnType<typeof mapPrimitiveValue>;
declare type NestedPrimitiveValue = PValue | NestedPrimitiveValue[];
export declare function unflattenContantValue(typeDef: RelTypeDef, value: PrimitiveValue[]): NestedPrimitiveValue;
export {};
