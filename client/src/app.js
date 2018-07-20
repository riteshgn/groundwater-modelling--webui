'use strict';

import Vue from 'vue';

// Import all style sheets
import 'mdbootstrap/css/bootstrap.min.css';
import 'mdbootstrap/css/mdb.min.css';
// Import local fonts library (font-awesome)
import 'font-awesome/css/font-awesome.min.css';

import Header from './views/header/Header.vue';
import Main from './views/main/Main.vue';

import store from './store';

new Vue({
    el: '#app',

    store,

    components: {
        'app-header': Header,
        'app-main': Main
    }
});

////////////////////////////////////////////////////////////////////////////////////////////