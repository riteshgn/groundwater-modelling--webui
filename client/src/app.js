'use strict';

import Vue from 'vue';

// Import all vendor style sheets
import 'bootstrap/dist/css/bootstrap.css';
import 'mdbvue/build/css/mdb.css';
import 'font-awesome/css/font-awesome.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'animate.css/animate.min.css';
// Import all app style sheets
import './app.css'

import './config/logger';
import './config/plugins';
import store from './store';
import App from './App.vue'

if (!ENV_PRODUCTION) {
    // Adds a menu to check for accessibilty parameters
    // ref: http://khan.github.io/tota11y/
    require('tota11y/build/tota11y.min.js');
}

new Vue({
    el: '#app',

    store,

    components: {
        'app': App
    },

    template: '<app></app>'
});

////////////////////////////////////////////////////////////////////////////////////////////