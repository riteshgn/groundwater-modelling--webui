'use strict';

import Vue from 'vue';

const NotifyBus = new Vue();

export default install;

/////////////////////////////////////////////

function install(Vue) {
    Vue.prototype.$bus = NotifyBus;
}