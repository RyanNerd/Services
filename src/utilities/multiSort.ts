/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SortObject {
    [index: string]: SortDirection;
}

export enum SortDirection {
    desc = 1,
    asc = -1,
    skip = 0
}

interface IArrayGeneric {
    [index: string]: any;
}

/**
 * Determine the sort direction by comparing sort key values
 * @param {number} a Comparison number a
 * @param {number} b Comparison number b
 * @param {SortDirection} direction The SortDirection enum value
 */
const keySort = (a: number, b: number, direction: SortDirection): number => {
    // If the values are the same, do not switch positions.
    if (a === b) {
        return 0;
    }

    // If `b > a`, multiply by -1 to get the reverse direction.
    return a > b ? direction : -1 * direction;
};

/**
 * Sorts an array of objects by column/property.
 * @link https://www.golangprograms.com/javascript-sort-multi-dimensional-array-on-specific-columns.html
 * @param {[{}]} array - The array of objects.
 * @param {SortObject} sortObject e.g. { age: 'desc', name: 'asc' }
 * @returns {[]} The sorted array.
 */
export const multiSort = (array: IArrayGeneric, sortObject: SortObject): [] => {
    const sortKeys = Object.keys(sortObject);

    return array.sort((a: {[x: string]: number}, b: {[x: string]: number}) => {
        let sorted = 0;
        let index = 0;

        // Loop until sorted (-1 or 1) or until the sort keys have been processed.
        while (sorted === 0 && index < sortKeys.length) {
            const key = sortKeys[index];
            const direction = sortObject[key];
            sorted = keySort(a[key], b[key], direction);
            index++;
        }
        return sorted;
    });
};
