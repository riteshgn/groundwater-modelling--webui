'use strict';

/**
 * function to create an array from a 3 lists. The 3 lists describe the i & j location and
 * the head of all constant head cells.
 * The resulting array has a value in all constant head (CHD) cells and a NaN in all cells
 * for which head will be modeled.
 */

import nj from 'numjs';

import MathUtils from '../../utils/MathUtils';

export default mkdChd;

////////////////////////////////////////////

function mkdChd(chd_i, chd_j, chd_h, sizer) {
    let hinit = MathUtils.scalarMult(nj.zeros(sizer).tolist(), undefined); // hinit is the initial head array

    // loop through all i,j,h values in the three lists and assign them to the array
    for (let i=0; i<chd_i.length; i++) {
        hinit[chd_j[i]][chd_i[i]] = chd_h[i];
    }
    return hinit;
}