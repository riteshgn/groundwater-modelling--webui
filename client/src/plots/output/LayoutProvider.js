const outputLayout = {
    showlegend: true,
    legend: {
        x: 100,
        y: 1,
        traceorder: 'normal',
        font: {
          family: 'Roboto',
          size: 10,
          color: '#212529'
        },
        bgcolor: '#f8f9fa',
        bordercolor: '#dedede',
        borderwidth: 1
    },
    xaxis: {
        showgrid: false,
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
        showgrid: false,
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
    width: 450,
    height: 350,
    margin: {l: 50, r: 0, b: 50, t: 25},
    autosize: false
}

export default outputLayout;