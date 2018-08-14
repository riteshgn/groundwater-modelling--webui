'use strict';

const layoutOutput = {
    font: { color: '#212529' },
    titlefont: { size: 14 },
    showlegend: true,
    legend: _composeLegend(),
    xaxis: _composeXaxisOptions(),
    yaxis: _composeYaxisOptions(),
    margin: {l: 50, r: 0, b: 50, t: 25},
    autosize: true
}

export default layoutOutput;

////////////////////////////////////////////////

function _composeLegend() {
    return {
        font: { size: 10 }
    };
}

function _composeXaxisOptions() {
    return {
        titlefont: { size: 12 },
        range: [0, 50],
        nticks: 50,
        showgrid: false,
        ticklen: 10,
        tickcolor: "#dedede",
        tickfont: { size: 10 },
        zeroline: false,
        showline: true,
        linecolor: '#7e7e7e',
        fixedrange: true
    };
}

function _composeYaxisOptions() {
    return {
        titlefont: { size: 12 },
        range: [0, 50],
        nticks: 50,
        showgrid: false,
        ticklen: 10,
        tickcolor: "#dedede",
        tickfont: { size: 10 },
        zeroline: false,
        showline: true,
        linecolor: '#7e7e7e',
        fixedrange: true
    };
}