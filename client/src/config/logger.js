'use strict';

/**
 * This module configures the logger which will be used throughout the
 * vuejs application.
 *
 * Within vuejs components the logger can be used as so
 * ==>  this.$log.<level>('Hello World')
 * where level can be one of ['debug', 'info', 'warn', 'error', 'fatal']
 *
 * Usage in an external function is as so
 * ==>  Vue.$log.debug('log from function outside component.');
 *
 * ref: https://github.com/justinkames/vuejs-logger#readme
 */

import Vue from 'vue';
import VueLogger from 'vuejs-logger';

const options = {
    // Enables the vuejs-logger plugin
    isEnabled: true,
    // Choose between ['debug', 'info', 'warn', 'error', 'fatal']
    logLevel : ENV_PRODUCTION ? 'error' : 'debug',
    // If true, all input will go through JSON.stringify()
    stringifyArguments : false,
    // If true, the loglevel will be shown
    showLogLevel : true,
    // If true, the method name of the parent function will be shown in the console
    showMethodName : false,
    // The seperator between parts of the output
    separator: '#', // 4 spaces; because '/t' did not work
    // If true, enables console.warn, console.fatal, console.error for corresponding loglevels.
    showConsoleColors: true
};

Vue.use(VueLogger, options);