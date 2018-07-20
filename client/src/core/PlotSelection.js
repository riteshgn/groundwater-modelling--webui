'use strict';

class PlotSelection {
    constructor() {
        this.x = {from: 0, to: 0, range: false};
        this.y = {from: 0, to: 0, range: false};
        this.value = null;
    }

    reset() {
        this.x = {from: 0, to: 0, range: false};
        this.y = {from: 0, to: 0, range: false};
        this.value = null;
    }

    clone() {
        const selection = new PlotSelection();

        selection.x = Object.assign({}, this.x);
        selection.y = Object.assign({}, this.y);
        selection.value = this.value;

        return selection;
    }

    static make({x, y, value}) {
        const selection = new PlotSelection();

        selection.x = x;
        selection.y = y;
        selection.value = value;

        return selection;
    }
}

export default PlotSelection;