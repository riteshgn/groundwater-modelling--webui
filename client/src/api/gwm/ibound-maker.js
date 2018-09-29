'use strict';

/**
 * create an ibound array, which describes the type of boundary in each cell
 * the boundary types are as follows: 1 well pumping, -1 constant head, 0 simulated (calculate heads)
 */

import nj from 'numjs';

export default function(hinit,wellterm,nrow,ncol) {
    let sizer=nj.array(hinit).shape; // size of the model
    let ibound=nj.ones(sizer).tolist(); // initialize array -- all cells simulated (=0) unless otherwise assigned
    for (let row=0; row<nrow; row++) { // loop through rows
        for (let col=0; col<ncol; col++) { // loop through columns
            if (wellterm[row][col]!=0)    // if theres a well in the cell, set ibound value =1
                ibound[row][col]=1;
            if (!isNaN(hinit[row][col])) // if cell is constant heas, set ibound value =-1
                ibound[row][col]=-1;
        }
    }
    return ibound;
}