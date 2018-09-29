'use strict';

import Vue from 'vue';
import nj from 'numjs';
import ndarray from 'ndarray';
import gaussianFilter from 'ndarray-gaussian-filter';
import __range from 'lodash/range';
import __flatMap from 'lodash/flatMap';

import Plot from '../api/plot';
import NdarrayUtils from './NdarrayUtils';

// CONSTANTS (TODO: move to a file?)
const conv_crit = 1e-3; // maximum change between heads in the same cell in
                        // neighboring outer iterations must be less than this
const SOR       = 1.75  // relaxation factor 1=Gauss-Seidel, 1-2 = SOR, < 1=under-relaxed
const maxLoops  = 1000  // maximum number of outer iterations

// assign reasonalble hydrualic condcutivities to gravel et al.,
// Units are m/d
const HYDRUALIC_CONDUCTIVITY = {
    gravel: parseFloat(10) ** 3,
    sand: parseFloat(10) ** 1,
    silt: parseFloat(10) ** -1,
    clay: parseFloat(10) ** -4
}

// smoothing constants in x & y directions of random K field
const connectivity_x = 1;
const connectivity_y = 1;

// Exposed APIs
const apis = {
    convertPlotSelectionToPlotlyData,
    prepare
}

export default apis;

/////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Processes data from the model and prepares them to be fed to the
 * simulation api (Plot).
 * Once data is ready from the Plot api returns the result
 */
async function prepare({row, column, recharge, gridThickness,
    modelLayout = 'map', soilType = 'random', constantHeads, wells}) {

    Vue.$log.debug(`Inputs provided: ${JSON.stringify(
        {row, column, recharge, gridThickness, modelLayout, soilType}
    )}`);

    const { cellarea, delx, dely, delz, K, nrow, ncol, sizer }
        = _initialize({ row, column, gridThickness, modelLayout, soilType });

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

    const cross_section_bool = modelLayout !== 'map';
    const rch_rate           = recharge.volume / recharge.days;    // recharge volume/day

    Vue.$log.debug('Sending all inputs to the Plot API');
    const {h, ni, qx, qy} = await Plot.prepare({
        sizer, rch_rate, cross_section_bool, cellarea,
        nrow, ncol, conv_crit, SOR, maxLoops, delx, dely,
        delz, K, chd, well
    });
    Vue.$log.debug('Received response from the Plot API');

    return {h, qx, qy, K};
}

/**
 * Converts an array of core/PlotSelection to points required by a
 * plotly trace configuration
 *
 * example:
 *     { x: { from: 0, to: 1, range: true },
 *       y: { from: 10, range: false},
 *       value: 50 }
 *
 *     is converted to =>
 *     { x: [0, 1], y: [10, 10], values: [50, 50]}
 */
function convertPlotSelectionToPlotlyData(plotSelections) {
    return (
        plotSelections
            .map(_extrapolatePoints)
            .reduce(_concatExtrapolation, {x: [], y: [], values: []})
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////

function _concatExtrapolation(out, points) {
    out.x = out.x.concat(points.x);
    out.y = out.y.concat(points.y);
    out.values = out.values.concat(points.values);
    return out;
}

function _extrapolatePoints(head) {
    let xs = [head.x.from];
    if (head.x.range) {
        xs = __range(head.x.from, head.x.to + 1);
    }

    let ys = [head.y.from];
    if (head.y.range) {
        ys = __range(head.y.from, head.y.to + 1);
    }

    let x = xs;
    let y = ys;

    if (xs.length > 1) {
        x = __flatMap(ys, () => xs);
        y = __flatMap(ys, (y) => Array(xs.length).fill(y));
    } else if (ys.length > 1) {
        x = __flatMap(xs, (x) => Array(ys.length).fill(x));
        y = __flatMap(xs, () => ys);
    }

    return {x, y, values: Array(x.length).fill(head.value)};
}

function _generateRandomKField(sizer) {
    // 1. randomly assign int value of 1-4 to an array the size of the model domain
    let K = NdarrayUtils.ceilNDArrElems(nj.random(sizer[0],sizer[1]).multiply(4).tolist());

    // 2. replace all 1's with Kgravel
    //                2's with Ksand
    //                3's with Ksilt
    //                4's with Kclay
    K = NdarrayUtils.findAndReplace(K, 1, HYDRUALIC_CONDUCTIVITY.gravel);
    K = NdarrayUtils.findAndReplace(K, 2, HYDRUALIC_CONDUCTIVITY.sand);
    K = NdarrayUtils.findAndReplace(K, 3, HYDRUALIC_CONDUCTIVITY.silt);
    K = NdarrayUtils.findAndReplace(K, 4, HYDRUALIC_CONDUCTIVITY.clay);

    // 3. smooth the Kfield with gaussian filter
    K = NdarrayUtils.toArray(
        gaussianFilter(
            ndarray(NdarrayUtils.flatten(K), sizer), [connectivity_y, connectivity_x]
        ),
        sizer
    );

    // 4. restretch following the smoothing to have values range from 10e-4 through 10e3

    // convert array to ndarr object so that we can apply numjs apis on it
    let Kndarr = nj.array(K);

    return (
        nj.exp(
            nj
                .log(Kndarr)
                .subtract(Math.log(Kndarr.min()))
                .multiply(Math.log(HYDRUALIC_CONDUCTIVITY.gravel) - Math.log(HYDRUALIC_CONDUCTIVITY.clay))
                .divide(Math.log(Kndarr.max()) - Math.log(Kndarr.min()))
                .add(Math.log(HYDRUALIC_CONDUCTIVITY.clay))
        ).tolist()
    );
}

function _initialize({row, column, gridThickness, modelLayout, soilType}) {
    const ncol               = row.count;       // number of columns in mode
    const nrow               = column.count ;   // number of rows in columns
    const sizer              = [nrow, ncol];    // duplet size of model domain

    const delx = row.width;     // x-thickness of cell
    const dely = column.width;  // y-thickness of cell

    let cellarea, delz;
    if (modelLayout === 'map') {
        cellarea = delx * dely;   // each model cell top has an area of row x col in map view
        delz     = gridThickness; // thickness into page = aquifer thickness
    } else {
        // cross sectional layout
        cellarea = delx * 1;      // model domain is only 1 unit into page in cross section
        delz     = 1;             // depth into page is one unit width
    }

    // initialize K values
    const K = (soilType === 'random')
        ? _generateRandomKField(sizer)
        : nj.ones(sizer).multiply(HYDRUALIC_CONDUCTIVITY[soilType]).tolist();

    return {sizer, cellarea, nrow, ncol, delx, dely, delz, K};
}