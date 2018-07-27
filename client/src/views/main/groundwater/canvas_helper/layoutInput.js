'use strict';

const layoutInput = {
    showlegend: true,
    legend: _composeLegend(),
    xaxis: _composeXaxisOptions(),
    yaxis: _composeYaxisOptions(),
    // dragmode: 'select',
    // hovermode: 'closest',
    // width: 450,
    // height: 350,
    margin: {l: 50, r: 0, b: 50, t: 25},
    autosize: true
}

export default layoutInput;

////////////////////////////////////////////////

function _composeLegend() {
    return {
        font: {
          size: 10,
          color: '#212529'
        }
    };
}

function _composeXaxisOptions() {
    return {
        range: [0, 50],
        nticks: 50,
        showgrid: true,
        ticklen: 10,
        tickcolor: "#dedede",
        tickfont: {
            family: 'Roboto',
            size: 12,
            color: '#212529',
        },
        zeroline: false,
        showline: true,
        linecolor: '#7e7e7e',
        fixedrange: true
    };
}

function _composeYaxisOptions() {
    return {
        range: [0, 50],
        nticks: 50,
        showgrid: true,
        ticklen: 10,
        tickcolor: "#dedede",
        tickfont: {
            family: 'Roboto',
            size: 12,
            color: '#212529'
        },
        zeroline: false,
        showline: true,
        linecolor: '#7e7e7e',
        fixedrange: true
    };
}