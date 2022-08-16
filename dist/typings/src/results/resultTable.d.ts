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
import { RelTypeDef, RelTypedValue } from './types';
export interface ResultColumn {
    /**
     * Returns type definition of the column
     *
     * @returns Type definition.
     */
    typeDef: RelTypeDef;
    /**
     * Returns an iterator over column values.
     *
     * @returns An iterator over column values.
     */
    [Symbol.iterator](): IterableIterator<RelTypedValue['value']>;
    /**
     * Returns column values as an array
     *
     * @returns An array of column values.
     */
    values: () => RelTypedValue['value'][];
    /**
     * Return a value at the given index.
     *
     * @param {string} index Row index.
     * @returns Value or undefined if the index is out of range.
     */
    get: (index: number) => RelTypedValue['value'] | undefined;
    /**
     * Number of values in the column.
     *
     * @returns Number of values.
     */
    readonly length: number;
}
interface IteratorOf<T> {
    [Symbol.iterator](): IterableIterator<T>;
    values: () => T[];
    readonly length: number;
}
/**
 * ResultTable provides an interface over {@link ArrowRelation} that maps Rel
 * types to their corresponding JavaScript equivalents.
 */
export declare class ResultTable implements IteratorOf<RelTypedValue['value'][]> {
    private relation;
    private table;
    private colDefs;
    /**
     * Instantiate a new ResultTable instance.
     *
     * @example
     *   cosnt result = await client.exec('database', 'engine', 'def output = 123, "test"')
     *   cosnt table = new ResultTable(result.results[0]);
     *
     *   console.log(table.values()); // Prints [[123n, "test"]];
     *
     * @param relation Arrow relation
     */
    constructor(relation: ArrowRelation);
    /**
     * Return an array of type definitions per column. Shortcut for column.typeDef.
     *
     * @returns An array of type definitions.
     */
    typeDefs(): RelTypeDef[];
    /**
     * The number of columns in this table.
     *
     * @returns The number of columns.
     */
    get columnLength(): number;
    /**
     * Return an array of columns.
     *
     * @returns An array of columns.
     */
    columns(): ResultColumn[];
    /**
     * Return column at the given index.
     *
     * @param index The column index.
     * @returns The column, or undefined if the index is out of range.
     */
    columnAt(index: number): ResultColumn;
    /**
     * Return a new table containing only specified columns.
     *
     * @param begin The beginning of the specified portion of the Table.
     * @param end The end of the specified portion of the Table. This is
     *   exclusive of the element at the index 'end'.
     * @returns A new ResultTable.
     */
    sliceColumns(begin: number | undefined, end?: number | undefined): ResultTable;
    /**
     * The number of rows in this table.
     *
     * @returns The number of rows.
     */
    get length(): number;
    /**
     * Return an iterator over rows.
     *
     * @returns An iterator over rows
     */
    [Symbol.iterator](): Generator<(string | number | bigint | boolean | Record<string, any> | Date | import("decimal.js").default | {
        numerator: number;
        denominator: number;
    } | {
        numerator: number; /**
         * Return a new table containing only specified columns.
         *
         * @param begin The beginning of the specified portion of the Table.
         * @param end The end of the specified portion of the Table. This is
         *   exclusive of the element at the index 'end'.
         * @returns A new ResultTable.
         */
        denominator: number;
    } | {
        numerator: number;
        denominator: number;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | (string | number | bigint | boolean | Date | import("decimal.js").default | {
        numerator: number;
        denominator: number;
    } | {
        numerator: number; /**
         * Return a new table containing only specified columns.
         *
         * @param begin The beginning of the specified portion of the Table.
         * @param end The end of the specified portion of the Table. This is
         *   exclusive of the element at the index 'end'.
         * @returns A new ResultTable.
         */
        denominator: number;
    } | {
        numerator: number;
        denominator: number;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | null)[] | null)[], void, unknown>;
    /**
     * Return an array of rows.
     *
     * @returns An array of rows.
     */
    values(): (string | number | bigint | boolean | Record<string, any> | Date | import("decimal.js").default | {
        numerator: number;
        denominator: number;
    } | {
        numerator: number; /**
         * Return a new table containing only specified columns.
         *
         * @param begin The beginning of the specified portion of the Table.
         * @param end The end of the specified portion of the Table. This is
         *   exclusive of the element at the index 'end'.
         * @returns A new ResultTable.
         */
        denominator: number;
    } | {
        numerator: number;
        denominator: number;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | (string | number | bigint | boolean | Date | import("decimal.js").default | {
        numerator: number;
        denominator: number;
    } | {
        numerator: number; /**
         * Return a new table containing only specified columns.
         *
         * @param begin The beginning of the specified portion of the Table.
         * @param end The end of the specified portion of the Table. This is
         *   exclusive of the element at the index 'end'.
         * @returns A new ResultTable.
         */
        denominator: number;
    } | {
        numerator: number;
        denominator: number;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | null)[] | null)[][];
    /**
     * Return row at the given index.
     *
     * @param {string} index Row index.
     * @returns The row or undefined if the index is out of range.
     */
    get(index: number): (string | number | bigint | boolean | Record<string, any> | Date | import("decimal.js").default | {
        numerator: number;
        denominator: number;
    } | {
        numerator: number; /**
         * Return a new table containing only specified columns.
         *
         * @param begin The beginning of the specified portion of the Table.
         * @param end The end of the specified portion of the Table. This is
         *   exclusive of the element at the index 'end'.
         * @returns A new ResultTable.
         */
        denominator: number;
    } | {
        numerator: number;
        denominator: number;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | (string | number | bigint | boolean | Date | import("decimal.js").default | {
        numerator: number;
        denominator: number;
    } | {
        numerator: number; /**
         * Return a new table containing only specified columns.
         *
         * @param begin The beginning of the specified portion of the Table.
         * @param end The end of the specified portion of the Table. This is
         *   exclusive of the element at the index 'end'.
         * @returns A new ResultTable.
         */
        denominator: number;
    } | {
        numerator: number;
        denominator: number;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | {
        numerator: bigint;
        denominator: bigint;
    } | null)[] | null)[] | undefined;
    /**
     * Return a new table that's a sub-section of this table.
     *
     * @param begin The beginning of the specified portion of the Table.
     * @param end The end of the specified portion of the Table. This is
     *   exclusive of the element at the index 'end'.
     * @returns A new ResultTable.
     */
    slice(begin: number | undefined, end?: number | undefined): ResultTable;
    /**
     * Prints this table using console.log.
     *
     * Note: it uses getDisplayValue function to convert values to strings.
     */
    print(): void;
    /**
     * Return a new table containing only physical columns. Specialized columns
     * are not included.
     *
     * @returns A new ResultTable.
     */
    physical(): ResultTable;
    /**
     * Return Arrow Table that's being used internally
     *
     * @returns Arrow Table
     */
    arrow(): Table<any>;
}
export {};
