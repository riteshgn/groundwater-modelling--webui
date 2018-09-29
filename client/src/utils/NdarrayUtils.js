'use strict';

import __mean from 'lodash/mean';

const apis = {
    ceilNDArrElems,
    findAndReplace,
    flatten,
    nanMean,
    parseNDArrElemsAsInt,
    toArray
}

export default apis;

////////////////////////////////////////////////

/**
 * example:
 *     [[1,2], [3,4]] => [1,2,3,4]
 */
function flatten(arr)
{
    if (!arr.length)
        return [];

    if (arr[0].length)
        return arr
                .map((childArr) => flatten(childArr))
                .reduce((out, childArr) => out.concat(childArr), []);

    return arr;
}

/**
 * example:
 *     transforms [1,2,3,4,5,6] with shape [2,3] to
 *     [[1,2,3], [4,5,6]]
 *     where shape 2x3 is the rows & cols
 */
function toArray(ndarr, shape)
{
    let oneDimArr = ndarr.data;
    let cols = shape[1];

    let temp = [];
    let output = [];
    for (let i=0; i<oneDimArr.length; i++) {
        let elem = oneDimArr[i];
        if (temp.length === cols) {
            output.push(temp.slice());
            temp = [];
        }

        temp.push(elem);
    }

    if (temp.length)
        output.push(temp.slice());

    return output;
}

function nanMean(arr) {
    const oneDimArr = flatten(arr).filter((elem) => !isNaN(elem));
    if (oneDimArr.length) {
        return __mean(oneDimArr);
    }
    return 0;
}

function ceilNDArrElems(arr) {
    if (!arr.length)
        return [];

    if (arr[0].length)
        return arr.map((childArr) => ceilNDArrElems(childArr));

    return arr.map((x) => Math.ceil(x));
}

function parseNDArrElemsAsInt(arr) {
    if (!arr.length)
        return [];

    if (arr[0].length)
        return arr.map((childArr) => parseNDArrElemsAsInt(childArr));

    return arr.map((x) => parseInt(x));
}

/**
 * example:
 *     in [[1,2], [3,1]] replace 1's with 4's
 *     result = [[4,2], [3,4]]
 */
function findAndReplace(arr, replaceThis, withThis) {
    if (!arr.length)
        return [];

    if (arr[0].length)
        return arr.map((childArr) => findAndReplace(childArr, replaceThis, withThis));

    return arr.map((x) => x === replaceThis ? withThis : x);
}