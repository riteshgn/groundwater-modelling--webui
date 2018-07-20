'use strict';

import nj from 'numjs';
import ndarray from 'ndarray';
import gaussianFilter from 'ndarray-gaussian-filter';
import __ from 'lodash';

import Plot from '../api/plot';
import NdarrayUtils from './NdarrayUtils';

const apis = {
    prepare
}

export default apis;

///////////////////////////////////

/**
 * Demo function which
 *  - creates random input data for map view
 *  - passes the inputs to the 'preapre plot' API
 *  - returns the output along with the randomly generated heads & wells
 */

async function prepare({row, column, rechargeRate, thickness, constantHeads, wells}) {
    const {sizer, rch_rate, cross_section_bool, cellarea,
        nrow, ncol, conv_crit, SOR, maxLoops,
        delx, dely, delz, K, Kclay, Kgravel} = _initialize({row, column, rechargeRate, thickness});

    const chd = {
        i: constantHeads.x,
        j: constantHeads.y,
        h: constantHeads.values
    };
    const well = {
        i: wells.x,
        j: wells.y,
        Q: wells.values
    };

    const {h, ni, qx, qy} = await Plot.prepare({
        sizer, rch_rate, cross_section_bool, cellarea,
        nrow, ncol, conv_crit, SOR, maxLoops, delx, dely,
        delz, K, chd, well
    });
    return {h};
}

/////////////////////////////////////////////////////////////////////////////////////////////

function _initialize({row, column, rechargeRate, thickness}) {
    let delx = row.width; //x-thickness of cell
    let dely = column.width; //y-thickness of cell
    let unitThickness = thickness; //defines delz if it's mapView, delz is 1 in cross-section

    let ncol = row.count; //number of columns in mode
    let nrow = column.count //number of rows in columns
    let sizer=[nrow,ncol] //duplet size of model domain

    let conv_crit=1e-3 //maximum change between heads in the same cell in neighboring outer iterations must be less than this
    let SOR=1.75 //relaxation factor 1=Gauss-Seidel, 1-2 = SOR, < 1=under-relaxed
    let maxLoops=1000 //maximum number of outer iterations

    let rch_rate = rechargeRate; // recharge volume/day

    let cross_section_bool=false //cross sectional or map view
    //it's map view
    let cellarea=delx*dely //each model cell top has an area of row x col in map view
    let delz=unitThickness //thickness into page = aquifer thickness
    if (cross_section_bool) { //it's cross sectional model
        cellarea=delx*1 //model domain is only 1 unit into page in cross section
        delz=1 //depth into page is one unit width
    }

    //initialize K values
    // assign reasonalble hydrualic condcutivities to gravel et al.,
    let Kgravel=parseFloat(10)**3//m/d //  '**' means "^"
    let Ksand=parseFloat(10)**1//m/d
    let Ksilt=parseFloat(10)**-1//m/d
    let Kclay=parseFloat(10)**-4//m/d

    let randomKbool=true //should we generate a random K?
    let connectivity_x=1 //smoothing in x direction of random K field
    let connectivity_y=1 //smoothing in x direction of random K field

    let aquitard=-1  //>=0 there is an aquitard at row // (negative value means no aquitard), if we want to add a single clay layer in part of the domain
    let aquitardThick=3 // aquitard thickness

    let K=[];
    //%% generate K field
    if (randomKbool) { //if we're generating a radom K field
        K=NdarrayUtils.ceilNDArrElems(nj.random(sizer[0],sizer[1]).multiply(4).tolist()) //randomly assign int value of 1-4 to an array the size of the model domain
        K=NdarrayUtils.findAndReplace(K,1,Kgravel);
        K=NdarrayUtils.findAndReplace(K,2,Ksand);
        K=NdarrayUtils.findAndReplace(K,3,Ksilt);
        K=NdarrayUtils.findAndReplace(K,4,Kclay);

        //smooth the Kfield with gaussian filter
        K = NdarrayUtils.toArray(
            gaussianFilter(
                ndarray(NdarrayUtils.flatten(K), sizer), [connectivity_y,connectivity_x]
            ),
            sizer
        );

        //restretch following the smoothing to have values range from 10e-4 through 10e3
        let Kndarr = nj.array(K);
        K = nj.exp(
            nj
                .log(Kndarr)
                .subtract(Math.log(Kndarr.min()))
                .multiply(Math.log(Kgravel) - Math.log(Kclay))
                .divide(Math.log(Kndarr.max()) - Math.log(Kndarr.min()))
                .add(Math.log(Kclay))
        ).tolist();
    } else {
        K = nj.ones(sizer).multiply(Ksand).tolist();
    }

    if (aquitard+aquitardThick>nrow) //if this would draw an aquitard out of bounds, don't do it!
        aquitard=-1
        console.log('Aquitard out of bounds -- turned off')
    /*if aquitard>=0: //if we are drawing an aquitard, add 'aquitardThick' rows of clay to domain starting at row 'aquitard'
        K[aquitard:aquitard+aquitardThick,:]=Kclay*/

    return {sizer, rch_rate, cross_section_bool, cellarea,
        nrow, ncol, conv_crit, SOR, maxLoops,
        delx, dely, delz, K, Kclay, Kgravel}
}