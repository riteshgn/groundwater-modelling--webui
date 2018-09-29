'use strict';

const apis = {
    scalarMult,
    scalarAdd,
    fpLessThan
}

export default apis;

/////////////////////////////////////////////////////////////

/**
 * example:
 *     [[1,2], [3,4]] * 2 = [[2,4], [6,8]]
 */
function scalarMult(arr, n) {
    if (!arr.length)
        return [];

    if (arr[0].length)
        return arr.map((childArr) => scalarMult(childArr, n));

    return arr.map((x) => x*n);
}

/**
 * example:
 *     [[1,2], [3,4]] + 2 = [[3,4], [5,6]]
 */
function scalarAdd(arr, n) {
    if (!arr.length)
        return [];

    if (arr[0].length)
        return arr.map((childArr) => scalarAdd(childArr, n));

    return arr.map((x) => x+n);
}

/**
 * floating point comparisons with zero does not work as expected.
 * using solution based on: https://gist.github.com/nfreear/5927529
 */
function fpLessThan(thisNum, thatNum) {
    return (thisNum - thatNum < Number.EPSILON) && (Math.abs(thisNum - thatNum) > Number.EPSILON);
};