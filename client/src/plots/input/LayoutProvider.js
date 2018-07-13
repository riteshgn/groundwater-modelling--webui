'use strict';

const inputLayout = {
    xaxis: {
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
    },
    yaxis: {
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
    },
    dragmode: 'select',
    width: 450,
    height: 350,
    margin: {l: 50, r: 10, b: 50, t: 25},
    autosize: false
};

export default inputLayout;