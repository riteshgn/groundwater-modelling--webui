'use strict';

import range from 'lodash/range';

const traces = {
    EMPTY_CONSTANT_HEADS: {
        name: 'C. Head',
        type: 'scatter',
        mode: 'markers',
        x: [],
        y: [],
        marker: {size: 9, color: '1c10ea'},
        showscale: false
    },

    EMPTY_WELLS: {
        name: 'Well',
        type: 'scatter',
        mode: 'markers',
        x: [],
        y: [],
        marker: {size: 9, color: 'f44242'},
        showscale: false
    },

    EMPTY_CONTOUR: {
        name: 'Contour',
        z: [],
        type: 'contour',
        colorscale: 'YlGnBu',
        colorbar: {
            ypad: 30,
            y: 0.40
        }
    },

    DEFAULT_RECHARGE_CROSS_SECTIONAL: {
        name: 'Recharge',
        type: 'scatter',
        mode: 'markers',
        x: range(0, 50),
        y: Array(50).fill(50),
        marker: {size: 9, color: 'e0f400'}
    }
}

export default traces;