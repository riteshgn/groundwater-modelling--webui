'use strict';

import PlotUtils from './PlotUtils';

/**
 * Prepares the following output plots
 *   - contour based on generated inputs
 *   - const heads
 *   - wells
 */

export default async function() {
    // use the PlotUtils module to generate plots for randomly generated inputs
    const {h, chd_i, chd_j, well_i, well_j} = await PlotUtils.prepare();

    // create the plotly chart data using the prepared dataset
    return _create({h, chd_i, chd_j, well_i, well_j});
};

/////////////////////////////////////////////////

function _create({h, chd_i, chd_j, well_i, well_j}) {
    const contours = {
        name: 'Contour',
        z: h,
        type: 'contour',
        colorscale: 'YlGnBu',
        colorbar: {
            ypad: 30,
            y: 0.40
        }
    }

    const constHeads = {
        name: 'River',
        x: chd_i,
        y: chd_j,
        type: 'scatter',
        mode: 'lines',
        line: {width: 5, color: '1c10ea'},
        showscale: false
    }

    const wells = {
        name: 'Well',
        x: well_i,
        y: well_j,
        type: 'scatter',
        mode: 'markers',
        marker: {size: 9, color: 'f44242'},
        showscale: false
    }

    return [contours, constHeads, wells];
}