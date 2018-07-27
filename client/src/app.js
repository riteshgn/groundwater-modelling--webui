'use strict';

import Vue from 'vue';

// Import all style sheets
import 'bootstrap/dist/css/bootstrap.css';
import 'mdbvue/build/css/mdb.css';
// Import local fonts library (font-awesome)
import 'font-awesome/css/font-awesome.min.css';

import store from './store';

import App from './App.vue'

new Vue({
    el: '#app',

    store,

    components: {
        'app': App
    },

    template: '<app></app>'
});

////////////////////////////////////////////////////////////////////////////////////////////