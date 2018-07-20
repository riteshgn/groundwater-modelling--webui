'use strict';

const store = {
    namespaced: true,

    state: {
        showIntro: true,
        showModellingSystem: false
    },

    mutations: {
        START_MODELLING
    }
}

export default store;

///////////////////////////////////////////////////////////////////

function START_MODELLING(state) {
    state.showIntro = false;
    state.showModellingSystem = true;
}