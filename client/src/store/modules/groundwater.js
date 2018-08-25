'use strict';

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
        // options are map or cross_section
        modelLayout: DEFAULTS.modelLayout,

        // row definition for the grid
        row: { count: DEFAULTS.row.count, width: DEFAULTS.row.width },

        // column definition for the grid
        column: { count: DEFAULTS.column.count, width: DEFAULTS.column.width },

        // thickness of the grid
        gridThickness: DEFAULTS.gridThickness,

        // recharge parameters required to compute the recharge rate
        recharge: { volume: DEFAULTS.recharge.volume, days: DEFAULTS.recharge.days },

        // selected soil type
        soilType: DEFAULTS.soilType,

        // computed hydraulic constants array based on selected soil type
        soil: [],

        // array of class core/PlotSelection defining the head selections
        constantHeads: [],

        // configuration for constant head selection which will not be
        // added to constant heads - hence not included in final simulation
        constantHeadsForPreview: null,

        // array of class core/PlotSelection defining the well selections
        wells: [],

        // configuration for wells selection which will not be
        // added to wells - hence not included in final simulation
        wellsForPreview: null,

        // value of the selection made on the canvas
        canvasSelectionValue: null,

        // flag defining if the output should be displayed (TODO: move to app store?)
        showOutput: false,

        // maintains the execution state of the simulation.
        // possible values: 'INIT', 'IN_PROGRESS' & 'COMPLETED'
        simulationState: 'INIT',

        // output heads
        contourMap: [],

        // output quiver coordinates
        quiver: { x:[], y:[] }
    },

    getters: {
        basicConfigReady,
        canvasSummary,
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
        ADD_CONSTANT_HEAD_CONFIG_FOR_PREVIEW,
        ADD_WELLS_CONFIG,
        ADD_WELLS_CONFIG_FOR_PREVIEW,
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
    const mainSelection = PlotUtils.convertPlotSelectionToPlotlyData(state.constantHeads);

    if (state.constantHeadsForPreview !== null) {
        const previewSelection = PlotUtils.convertPlotSelectionToPlotlyData([state.constantHeadsForPreview]);
        mainSelection.x = mainSelection.x.concat(previewSelection.x);
        mainSelection.y = mainSelection.y.concat(previewSelection.y);
        mainSelection.values = mainSelection.values.concat(previewSelection.values);
    }

    return mainSelection;
}

function wellsSelection(state) {
    const mainSelection = PlotUtils.convertPlotSelectionToPlotlyData(state.wells);

    if (state.wellsForPreview !== null) {
        const previewSelection = PlotUtils.convertPlotSelectionToPlotlyData([state.wellsForPreview]);
        mainSelection.x = mainSelection.x.concat(previewSelection.x);
        mainSelection.y = mainSelection.y.concat(previewSelection.y);
        mainSelection.values = mainSelection.values.concat(previewSelection.values);
    }

    return mainSelection;
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

function canvasSummary(state) {
    const view = state.modelLayout === 'map' ? 'Map' : 'Cross Section';
    const rechargeRate = (state.recharge.volume / state.recharge.days);

    const soilTypes = {
        gravel: 'Gravel',
        sand: 'Sand',
        silt: 'Silt',
        clay: 'Clay',
        random: 'Randomized'
    };

    return {
        layout: view,
        height: `${(state.row.count * state.row.width)}m`,
        width: `${(state.column.count * state.column.width)}m`,
        thickness: `${(state.gridThickness)}m`,
        soil: soilTypes[state.soilType],
        rechargeRate: `${rechargeRate.toExponential(3)}`
    }
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
    state.constantHeadsForPreview = null;
}

function ADD_CONSTANT_HEAD_CONFIG_FOR_PREVIEW(state, plotSelection) {
    state.constantHeadsForPreview = plotSelection;
}

function REMOVE_CONSTANT_HEAD_CONFIG(state, srNo) {
    // splice API accepts array index of element
    // array index starts from 0
    // where srNo starts from 1
    state.constantHeads.splice(srNo - 1, 1);
}

function ADD_WELLS_CONFIG(state, plotSelection) {
    state.wells.push(plotSelection);
    state.wellsForPreview = null;
}

function ADD_WELLS_CONFIG_FOR_PREVIEW(state, plotSelection) {
    state.wellsForPreview = plotSelection;
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
    state.constantHeadsForPreview = null;
}

function RESET_MODEL_CONFIG_WELLS(state) {
    state.wells.splice(0);
    state.wellsForPreview = null;
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