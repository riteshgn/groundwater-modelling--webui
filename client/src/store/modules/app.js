'use strict';

const DEFAULTS = {
    showIntro: true,
    showModellingSystem: false,
    editableCanvas: false,
    canvasSelectionType: 'POINT',
    tabSelection: { basic: true,
                    heads: false,
                    wells: false }
}

const store = {
    namespaced: true,

    state: {
        // flag defining if the introduction section should be displayed
        showIntro: DEFAULTS.showIntro,
        // flag defining if the modelling section should be displayed
        showModellingSystem: DEFAULTS.showModellingSystem,
        // flag defining if the canvas is editable
        editableCanvas: DEFAULTS.editableCanvas,
        // selected drawing method on the canvas
        canvasSelectionType: DEFAULTS.canvasSelectionType,
        // selected tab in the configuration toolbox
        tabSelection: DEFAULTS.tabSelection,
    },

    getters: {
        selectedConfigurationTab
    },

    mutations: {
        MAKE_CANVAS_EDITABLE,
        SET_TAB_SELECTION_BASIC,
        SET_TAB_SELECTION_HEADS,
        SET_TAB_SELECTION_WELLS,
        START_MODELLING,
        UPDATE_CANVAS_SELECTION_TYPE
    }
}

export default store;

///////////////////////////////////////////////////////////////////

function selectedConfigurationTab(state) {
    for (let key in state.tabSelection) {
        if (state.tabSelection[key]) return key;
    }
}

///////////////////////////////////////////////////////////////////

function MAKE_CANVAS_EDITABLE(state, flag) {
    state.editableCanvas = flag;
}

function SET_TAB_SELECTION_BASIC(state, flag) {
    state.tabSelection.basic = flag;
    if (flag) {
        // canvas should not be editable if the selected tab is 'BASIC'
        state.editableCanvas = false;
    }
}

function SET_TAB_SELECTION_HEADS(state, flag) {
    state.tabSelection.heads = flag;
}

function SET_TAB_SELECTION_WELLS(state, flag) {
    state.tabSelection.wells = flag;
}

function START_MODELLING(state) {
    state.showIntro = false;
    state.showModellingSystem = true;
}

function UPDATE_CANVAS_SELECTION_TYPE(state, value) {
    state.canvasSelectionType = value;
}