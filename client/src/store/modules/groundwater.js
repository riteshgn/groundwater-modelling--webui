'use strict';

import __ from 'lodash';

import PlotUtils from '../../utils/PlotUtils';

const store = {
    namespaced: true,

    state: {
        // array of class core/PlotSelection
        constantHeads: [],
        // array of class core/PlotSelection
        wells: [],

        row: { count: 50, width: 10 },

        column: { count: 50, width: 10 },

        rechargeRate: (.3/365), // m/d - recharge volume/day

        mapView: true,

        thickness: 100,

        contourMap: [],

        showOutput: false,

        simulationState: 'INIT'
    },

    getters: {
        stringifiedHeads,
        stringifiedWells,
        constantHeadsSelection,
        wellsSelection,
    },

    mutations: {
        ADD_CONSTANT_HEAD_CONFIG,
        REMOVE_CONSTANT_HEAD_CONFIG,
        ADD_WELLS_CONFIG,
        REMOVE_WELLS_CONFIG,
        SAVE_CONTOUR_MAP,
        SHOW_OUTPUT,
        CHANGE_SIMULATION_STATE,
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

function SHOW_OUTPUT(state) {
    state.showOutput = true;
}

function CHANGE_SIMULATION_STATE(state, value) {
    state.simulationState = value;
}

//////////////////////////////////////////////////////////////////////

async function simulate({ state, commit, getters }) {
    commit('CHANGE_SIMULATION_STATE', 'IN_PROGRESS');

    const headsSelection = getters.constantHeadsSelection;
    const wellsSelection = getters.wellsSelection;

    const {h} = await PlotUtils.prepare({
        row: state.row,
        column: state.column,
        rechargeRate: state.rechargeRate,
        thickness: state.thickness,
        constantHeads: headsSelection,
        wells: wellsSelection
    });

    commit('SAVE_CONTOUR_MAP', h);
    commit('SHOW_OUTPUT');
    commit('CHANGE_SIMULATION_STATE', 'COMPLETED');
}

//////////////////////////////////////////////////////////////////////

function _extrapolatePoints(head) {
    let xs = [head.x.from];
    if (head.x.range) {
        xs = __.range(head.x.from, head.x.to + 1);
    }

    let ys = [head.y.from];
    if (head.y.range) {
        ys = __.range(head.y.from, head.y.to + 1);
    }

    let x = xs;
    let y = ys;

    if (xs.length > 1) {
        x = __.flatMap(ys, () => xs);
        y = __.flatMap(ys, (y) => Array(xs.length).fill(y));
    } else if (ys.length > 1) {
        x = __.flatMap(xs, (x) => Array(ys.length).fill(x));
        y = __.flatMap(xs, () => ys);
    }

    return {x, y, values: Array(x.length).fill(head.value)};
}

function _concatExtrapolation(out, points) {
    out.x = out.x.concat(points.x);
    out.y = out.y.concat(points.y);
    out.values = out.values.concat(points.values);
    return out;
}