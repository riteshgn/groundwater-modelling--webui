'use strict';

import GWM from '../gwm';

const api = {
    prepare
}

export default api;

///////////////////////////////////////////////////

/**
 * Solves Groundwater Equation (Darcy's law) for provided inputs
 * and returns below outputs
 *  - h        : data required to plot a contour map of the result
 *  - qx, qy   : the x & y directional quiver data
 *  - ni       : number of iterations used to prepare the result
 */

async function prepare({
    sizer, rch_rate, cross_section_bool, cellarea,
    nrow, ncol, conv_crit, SOR, maxLoops, delx, dely,
    delz, K, chd, well}) {

    // %% Build input arrays
    let hinit    = GWM.makeChd(chd.i, chd.j, chd.h, sizer);
    let wellterm = GWM.makeWells(well.i, well.j, well.Q, sizer);
    let rchterm  = GWM.makeRch(rch_rate, cross_section_bool, sizer, cellarea);
    let ibound   = GWM.makeIbound(hinit, wellterm, nrow, ncol);

    const {h, ni, qx, qy} = GWM.solveSOR({
        nrow,ncol,conv_crit,SOR,maxLoops,ibound,hinit,wellterm,
        rchterm,delx,dely,delz,cross_section_bool,K});

    return await Promise.resolve({h, ni, qx, qy});
}