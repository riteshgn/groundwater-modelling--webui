'use strict';

/**
 * Solves Groundwater Equation (Darcy's law) for provided inputs
 */

import Vue from 'vue';
import nj from 'numjs';

import NdarrayUtils from '../../utils/NdarrayUtils';

export default function ({
    nrow, ncol, conv_crit, SOR, maxLoops, ibound,
    hinit, wellterm, rchterm, delx, dely, delz,
    cross_section_bool, K
}) {
    // conv_crit = max error value acceptable for convergence
    // SOR = successive over relaxation value 1<SOR<2
    // maxloops = stop model after this many iterations to prevent limitless runs
    // ibound described the boundary type of each cell
    // hinit is the initial head values of the model
    // wellterm is the array decribing pumping rates in different cells
    // rchterm shows cells in which recharge occurs
    // delx, dely, delz are the x(col), y(row) and z(depth into page) dimensions of each model cell; Z is also total model thickness, because model is always 1 cell in z direction
    // cross_section_bool is boolean False = map view, True = cross-sectional view
    // K = array describing hydraulic conductivity field in the model

    // initialize
    let t          = new Date(); // time at start of solver
    let converged  = false; // loop until converged, initialize
    let ni         = 0; // outer iteration number initialize
    let hinit_mean = NdarrayUtils.nanMean(hinit);
    let h          = nj.array(hinit).clone().tolist();
    let max_err    = nj.zeros(maxLoops+4).tolist(); // list to store error at each iteration

    for (let row=0; row<nrow; row++) { // assign the average prescribed constant head value to all cells to speed up convergence
        for (let col=0; col<ncol; col++) {
            if (isNaN(h[row][col])) {
                h[row][col] = hinit_mean;
            }
        }
    }

    // loop until either converged or maxLoops is reached
    while (!converged) {
        // initialize outer loop
        for (let row=0; row<nrow; row++) { // outer loop - loop through iterations
            for (let col=0; col<ncol; col++) { // inner loop - loop through cells within a single iteration
                let h_old = h[row][col]; // before solving for new h, store old h
                // initialize inner loop
                let Csum,a,b,c,d,q;
                Csum=a=b=c=d=q=0; // clear/initialize looping values

                let satd = 1; // if it's a cross section
                if (!cross_section_bool) {
                    // if it's in map view, use boussinesq assumption that water only flows through saturated thickness of cell
                    // thereby reducing effective K
                    // to make this work for mapview unconfined aquifers, multiply the delz term by %sat (satd)
                    // where %sat is head(m-1)/delz. In other words, because the cell is not filled with water,
                    // water only flows through part of it, so K & fluxes are reduced
                    satd = h[row][col] / delz;
                }

                // if the cell is not a constant head cell, then solve for head. If it is a constant head cell, then head needn't be solved for
                if (ibound[row][col] > 0) {
                    // flow from above VV (no flow from above in row 0)
                    // calculate conductance value between each neighboring cell (u,d,l,r)

                    if (row > 0) {
                        // thisC = conductance value = Area*Kmean between 2 cells/dl
                        let thisC = satd*delz*delx*(K[row][col]+K[row-1][col])/2/dely;
                        // a_term is conductance times head to the left
                        a = thisC * h[row-1][col];
                        // if there is a cell here, add the conductance term to the denominator_sum_term
                        Csum += thisC;
                    }

                    // flow from below ^^ (no flow from above in last row)
                    if (row < nrow-1) {
                        let thisC = satd*delz*delx*(K[row][col]+K[row+1][col])/2/dely;
                        b = thisC * h[row+1][col];
                        Csum += thisC;
                    }

                    // flow from left ==>> (no flow from left in col 0)
                    if (col > 0) {
                        let thisC = satd*delz*dely*(K[row][col]+K[row][col-1])/2/delx;
                        c = thisC * h[row][col-1];
                        Csum += thisC;
                    }

                    // flow from right <<== (no flow from right in last col)
                    if (col < ncol-1) {
                        let thisC = satd*delz*dely*(K[row][col]+K[row][col+1])/2/delx;
                        d = thisC * h[row][col+1];
                        Csum += thisC;
                    }

                    // if either recharge term or wellterm have a volumetric flux entering/leaving domain
                    if ((rchterm[row][col] + wellterm[row][col]) != 0) {
                        q = wellterm[row][col] + rchterm[row][col];  // assign a value to q
                    }
                } // if (ibound[row][col] > 0)

                // console.log(`#5 Csum = ${Csum}`);

                // if conductance was calculated between this cell and at least one neightboring cell
                if (Csum != 0) {
                    // calculate a new head for the cell based on the previous head and the conductances/heads of neighboring cells
                    // h[row][col]=(a+b+c+d+q)/Csum // no SOR - Gauss Seidel method
                    h[row][col]=(1-SOR)*h[row][col]+SOR*(a+b+c+d+q)/Csum; // Use successive over relaxation (SOR) --  speed convergence with h from last iteration
                }

                // in a cross-sectional model, h must be >0 and <cell thickness
                if (!cross_section_bool) {
                    //head is below bottom of model domain, don't let that happen!
                    if (h[row][col] < 0) {
                        h[row][col] = 0;
                    }

                    // head is above top of model domain, don't let that happen!
                    if (h[row][col] > delz) {
                        h[row][col] = delz;
                    }
                }

                // calculate difference between the old h value and this new one
                let diff = h[row][col] - h_old;
                // if this difference is the biggest head difference in this iteration, store it.
                if (diff > max_err[ni]) {
                    max_err[ni] = diff; // store in list
                }

            } // for col
        } // for row

        // if all inner iterations changes are smaller than conv_crit, then the model is converged. Move on>finish up>plot
        if (max_err[ni] < conv_crit) {
            converged = true;
        }

        // if we've exceeded the max number of loops, return error and crash. We don't want to bore everyone watching this go infinitely
        if (ni > maxLoops) {
            converged = true;
        }
        ni += 1; //increment counter to track number of iterations
    } // while

    // print final solver stats
    Vue.$log.debug(`['loopNum = ', ${ni}]`);
    Vue.$log.debug(`(${ni},${max_err[ni]})`);
    Vue.$log.debug(`['${new Date() - t},' seconds elapsed']`);

    // initialize arrays to store flow in x and y directions (qx and qy)
    let qx = nj.zeros(nj.array(h).shape).tolist();
    let qy = nj.zeros(nj.array(h).shape).tolist();
    for (let row=1; row<nrow; row++) {
        for (let col=1; col<ncol; col++) {
            // calculate Darcy Velocity, q, (m/s) in the x direction with Darcy's Law (q=K*dh/dl)
            qx[row][col] = (K[row][col]+K[row][col])/2*(h[row][col]-h[row][col-1])/delx;
            // and the y direction
            qy[row][col]=(K[row][col]+K[row][col])/2*(h[row][col]-h[row-1][col])/dely;
        }
    }

    return {h, ni, qx, qy};
}