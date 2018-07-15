'use strict';

/**
 * Export all APIs provided by the GWM module
 */

import makeChd from './constant-head-maker';
import makeIbound from './ibound-maker';
import makeRch from './recharge-maker';
import makeWells from './wells-maker';
import solveSOR from './solver';

const api = {
    makeChd,
    makeIbound,
    makeRch,
    makeWells,
    solveSOR
}

export default api;