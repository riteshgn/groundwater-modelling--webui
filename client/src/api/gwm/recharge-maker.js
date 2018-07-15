'use strict';

/**
 * function to assign recharge to model cells. Recharge in each cell is the
 * sum of recharge rate (length/time) and the area of the top of the cell.
 *
 * The area of the top of the cell depends on the orientation of the model.
 *
 * recharge is prescribed to all cells if the model is map view, but only
 * row one (the top cells) if the model is cross sectional
 */

import nj from 'numjs';

import MathUtils from '../../utils/MathUtils';

export default function(rch_rate,cross_section_bool,sizer,cellarea) {
    // sizer is size of the model domain (mxn), cell area is area of each cell on the recharge face

    // initialize array
    let R=nj.zeros(sizer).tolist();

    // if the model is cross sectional (a vertical slice)
    if (cross_section_bool) {
        // top row (row=0) is assigned recharge rate
        for (let col=0; col<sizer[1]; col++) {
            // assign recharge rate to only cells in row 1
            R[0][col]=rch_rate;
        }
    }  else {
        // otherwise, it's map view, so all cells assigned recharge rate
        R=nj.ones(sizer).multiply(rch_rate).tolist();
    }

    // multiply rate by area of cell over which recharge is applied
    R = MathUtils.scalarMult(R, cellarea);
    return R;
}