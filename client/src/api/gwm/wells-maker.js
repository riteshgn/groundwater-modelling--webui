'use strict';

/**
 * function to create an array from 3 lists.
 * The 3 lists describe the i & j location and the pumping rate of all well cells.
 *
 * The resulting array has a non-zero value in all cells where pumping occurs and
 * a zero value where no pumping takes place.
 */

import nj from 'numjs';

export default function(well_i,well_j,well_Q,sizer) {
    // sizer is size of the model domain (mxn)
    // initialize array
    let Q = nj.zeros(sizer).tolist();

    // loop through three lists and asssign values to well array (Q)
    for (let i=0; i<well_i.length; i++) {
        Q[well_j[i]][well_i[i]]=well_Q[i];
    }
    return Q;
}