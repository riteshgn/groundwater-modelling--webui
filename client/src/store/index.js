'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import groundwater from './modules/groundwater';

Vue.use(Vuex);

const debug = !ENV_PRODUCTION;

const store = new Vuex.Store({
    modules: {
        app,
        groundwater
    },
    strict: debug
})

export default store;