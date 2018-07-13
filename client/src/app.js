'use strict';

// Import all style sheets
import 'mdbootstrap/css/bootstrap.min.css';
import 'mdbootstrap/css/mdb.min.css';
// Import local fonts library (font-awesome)
import 'font-awesome/css/font-awesome.min.css';

////////////////////////////////////////////////////////////////
/// INPUT PLOT
///////////////////////////////////////////////////////////////

import inputData from './plots/input/PlotData';
import inputLayout from './plots/input/LayoutProvider';

const inputDiv = document.getElementById('inputDiv');
Plotly.newPlot('inputDiv', inputData, inputLayout, {displayModeBar: false});

inputDiv.on('plotly_selected', (data) => {
    console.log(JSON.stringify(data));
    if (data && data.range) {
        const domainX = data.range.x.map(Math.floor);
        const domainY = data.range.y.map(Math.floor);
        alert(`You have selected\n        x from ${domainX[0]} to ${domainX[1]}\n        y from ${domainY[0]} to ${domainY[1]}`);
    }
});

////////////////////////////////////////////////////////////////
/// OUTPUT PLOT
///////////////////////////////////////////////////////////////

import outputData from './plots/output/PlotData';
import outputLayout from './plots/output/LayoutProvider';

Plotly.newPlot('outputDiv', outputData, outputLayout, {displayModeBar: false});