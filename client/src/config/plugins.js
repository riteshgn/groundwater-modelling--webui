'use strict';

/**
 * This module bootstraps Vue with the below plugins
 * - vuelidate: form validations
 *   ref: https://monterail.github.io/vuelidate/
 * - toasted: message toaster
 *   ref: https://www.npmjs.com/package/vue-toasted
 *
 * - NotifyBus: a message passing mechanism
 *   see: client/src/plugins/NotifyBus.js
 */

import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Toasted from 'vue-toasted';
import NotifyBus from '../plugins/NotifyBus';

Vue.use(Vuelidate);

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    theme: 'bubble'
});

Vue.use(NotifyBus);

