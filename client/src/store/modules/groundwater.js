'use strict';

import __range from 'lodash/range';
import __flatMap from 'lodash/flatMap';

import PlotUtils from '../../utils/PlotUtils';

const DEFAULTS = {
    row: { count: 50, width: 10 },
    column: { count: 50, width: 10 },
    gridThickness: 100,
    recharge: { volume: .3, days: 365 },
    soilType: 'random',
    modelLayout: 'map'
}

const store = {
    namespaced: true,

    state: {
        // array of class core/PlotSelection
        constantHeads: [],

        // array of class core/PlotSelection
        wells: [],

        row: { count: DEFAULTS.row.count, width: DEFAULTS.row.width },

        column: { count: DEFAULTS.column.count, width: DEFAULTS.column.width },

        gridThickness: DEFAULTS.gridThickness,

        recharge: { volume: DEFAULTS.recharge.volume, days: DEFAULTS.recharge.days },

        contourMap: [],

        showOutput: false,

        simulationState: 'INIT',

        quiver: { x:[], y:[] },

        soil: [],

        soilType: DEFAULTS.soilType,

        // options are map or cross_section
        modelLayout: DEFAULTS.modelLayout
    },

    getters: {
        basicConfigReady,
        canvasTitles,
        constantHeadsReady,
        constantHeadsSelection,
        stringifiedHeads,
        stringifiedWells,
        wellsReady,
        wellsSelection
    },

    mutations: {
        ADD_CONSTANT_HEAD_CONFIG,
        ADD_WELLS_CONFIG,
        CHANGE_SIMULATION_STATE,
        HIDE_OUTPUT,
        REMOVE_CONSTANT_HEAD_CONFIG,
        REMOVE_WELLS_CONFIG,
        RESET_MODEL_CONFIG,
        RESET_MODEL_CONFIG_BASIC,
        RESET_MODEL_CONFIG_CONSTANT_HEADS,
        RESET_MODEL_CONFIG_WELLS,
        SAVE_CONTOUR_MAP,
        SAVE_QUIVER,
        SAVE_SOIL,
        SHOW_OUTPUT,
        UPDATE_COLUMN_WIDTH,
        UPDATE_GRID_THICKNESS,
        UPDATE_MODEL_LAYOUT,
        UPDATE_RECHARGE_PERIOD,
        UPDATE_RECHARGE_VOLUME,
        UPDATE_ROW_WIDTH,
        UPDATE_SOIL_TYPE
    },

    actions: {
        simulate
    }
}

export default store;

///////////////////////////////////////////////////////////////////

function stringifySelections(selections) {
    return selections.map(({x, y, value}, index) => {
        const xStr = x.range ? `x: ${x.from} to ${x.to}` : `x: ${x.from}`;
        const yStr = y.range ? `y: ${y.from} to ${y.to}` : `y: ${y.from}`;
        return {srNo: index + 1, x: xStr, y: yStr, value};
    });
}

function stringifiedHeads(state) {
    return stringifySelections(state.constantHeads);
}

function stringifiedWells(state) {
    return stringifySelections(state.wells);
}

function constantHeadsSelection(state) {
    return (
        state.constantHeads
            .map(_extrapolatePoints)
            .reduce(_concatExtrapolation, {x: [], y: [], values: []})
    );
}

function wellsSelection(state) {
    return (
        state.wells
            .map(_extrapolatePoints)
            .reduce(_concatExtrapolation, {x: [], y: [], values: []})
    );
}

function basicConfigReady(state) {
    return (
        _isValidModelLayout(state.modelLayout)
        && _isValidGridDim(state.row, state.column, state.gridThickness)
        && _isValidRechargeRate(state.recharge)
        && _isValidSoilType(state.soilType)
    );
}

function constantHeadsReady(state) {
    return state.constantHeads.length > 0;
}

function wellsReady(state) {
    return state.wells.length > 0;
}

function canvasTitles(state) {
    const view = state.modelLayout === 'map' ? 'Map' : 'Cross Section';
    const rechargeRate = (state.recharge.volume / state.recharge.days);

    const mainTitle = [
        `Layout: ${view}`,
        `Height: ${(state.row.count * state.row.width)}m`,
        `Width: ${(state.column.count * state.column.width)}m`,
        `Recharge Rate: ${rechargeRate.toExponential(3)}`
    ].join(' / ');

    const xAxisTitle = 'Distance (meters)';
    const yAxisTitle = state.modelLayout === 'map' ? xAxisTitle : 'Elevation (meters)';

    return { mainTitle, xAxisTitle, yAxisTitle };
}

///////////////////////////////////////////////////////////////////////

function ADD_CONSTANT_HEAD_CONFIG(state, plotSelection) {
    state.constantHeads.push(plotSelection);
}

function REMOVE_CONSTANT_HEAD_CONFIG(state, srNo) {
    // splice API accepts array index of element
    // array index starts from 0
    // where srNo starts from 1
    state.constantHeads.splice(srNo - 1, 1);
}

function ADD_WELLS_CONFIG(state, plotSelection) {
    state.wells.push(plotSelection);
}

function REMOVE_WELLS_CONFIG(state, srNo) {
    // splice API accepts array index of element
    // array index starts from 0
    // where srNo starts from 1
    state.wells.splice(srNo - 1, 1);
}

function SAVE_CONTOUR_MAP(state, contourMap) {
    state.contourMap = contourMap;
}

function SAVE_QUIVER(state, quiver) {
    state.quiver.x = quiver.x;
    state.quiver.y = quiver.y;
}

function SAVE_SOIL(state, soil) {
    state.soil = soil;
}

function SHOW_OUTPUT(state) {
    state.showOutput = true;
}

function CHANGE_SIMULATION_STATE(state, value) {
    state.simulationState = value;
}

function UPDATE_MODEL_LAYOUT(state, value) {
    state.modelLayout = value;
}

function UPDATE_GRID_THICKNESS(state, value) {
    state.gridThickness = value;
}

function UPDATE_RECHARGE_PERIOD(state, value) {
    state.recharge.days = value;
}

function UPDATE_RECHARGE_VOLUME(state, value) {
    state.recharge.volume = value;
}

function UPDATE_COLUMN_WIDTH(state, value) {
    state.column.width = value;
}

function UPDATE_ROW_WIDTH(state, value) {
    state.row.width = value;
}

function UPDATE_SOIL_TYPE(state, value) {
    state.soilType = value;
}

function HIDE_OUTPUT(state) {
    state.showOutput = false;
    state.contourMap.splice(0);
    state.quiver.x.splice(0);
    state.quiver.y.splice(0);
    state.soil.splice(0);
}

function RESET_MODEL_CONFIG(state) {
    RESET_MODEL_CONFIG_BASIC(state);
    RESET_MODEL_CONFIG_CONSTANT_HEADS(state);
    RESET_MODEL_CONFIG_WELLS(state);
    HIDE_OUTPUT(state);
}

function RESET_MODEL_CONFIG_BASIC(state) {
    state.row.count = DEFAULTS.row.count;
    state.row.width = DEFAULTS.row.width;
    state.column.count = DEFAULTS.column.count;
    state.column.width = DEFAULTS.column.width;
    state.gridThickness = DEFAULTS.gridThickness;
    state.recharge.volume = DEFAULTS.recharge.volume;
    state.recharge.days = DEFAULTS.recharge.days;
    state.soilType = DEFAULTS.soilType;
    state.modelLayout = DEFAULTS.modelLayout;
}

function RESET_MODEL_CONFIG_CONSTANT_HEADS(state) {
    state.constantHeads.splice(0);
}

function RESET_MODEL_CONFIG_WELLS(state) {
    state.wells.splice(0);
}

//////////////////////////////////////////////////////////////////////

async function simulate({ state, commit, getters }) {
    commit('CHANGE_SIMULATION_STATE', 'IN_PROGRESS');

    const headsSelection = getters.constantHeadsSelection;
    const wellsSelection = getters.wellsSelection;

    const {h, qx, qy, K} = await PlotUtils.prepare({
        row: state.row,
        column: state.column,
        recharge: state.recharge,
        gridThickness: state.gridThickness,
        constantHeads: headsSelection,
        wells: wellsSelection,
        modelLayout: state.modelLayout,
        soilType: state.soilType
    });

    commit('SAVE_CONTOUR_MAP', h);
    commit('SAVE_QUIVER', { x: qx, y: qy });
    commit('SAVE_SOIL', K);
    commit('SHOW_OUTPUT');
    commit('CHANGE_SIMULATION_STATE', 'COMPLETED');
}

//////////////////////////////////////////////////////////////////////

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

function _concatExtrapolation(out, points) {
    out.x = out.x.concat(points.x);
    out.y = out.y.concat(points.y);
    out.values = out.values.concat(points.values);
    return out;
}

function _isValidModelLayout(layout) {
    return ['map', 'cross_section'].indexOf(layout) !== -1;
}

function _isValidGridDim(row, column, gridThickness) {
    return (
        row && row.count && row.width
        && column && column.count && column.width
        && gridThickness
    );
}

function _isValidRechargeRate(recharge) {
    return recharge && recharge.volume && recharge.days;
}

function _isValidSoilType(soilType) {
    return ['gravel', 'sand', 'silt', 'clay', 'random'].indexOf(soilType) !== -1;
}