<template>
    <!--Card-->
    <mdb-card :classes="['mb-4']">
        <!-- Card header -->
        <template slot="header">
            Heads & Flow Vectors (Map View)
        </template>
        <!-- /.Card header -->

        <!--Card content-->
        <template slot="body">
            <plotly-graph
                :traces="traces"
                :layout="layout"></plotly-graph>
        </template>
        <!--/.Card content-->
    </mdb-card>
    <!--/.Card-->
</template>

<script>
    import { mapGetters, mapState } from 'vuex';

    import MdbCard from '../../../../components/MdbCard.vue';
    import PlotlyGraph from '../../../../components/PlotlyGraph.vue';

    const GwmOutput = {
        data() {
            return {
                layout: _composeInitialLayout(),
                constantHeadsTrace: _componseInitialConstantHeadsTrace(),
                wellsTrace: _componseInitialWellsTrace(),
                contourTrace: _composeContourTrace()
            }
        },

        components: {
            'mdb-card': MdbCard,
            'plotly-graph': PlotlyGraph
        },

        computed: {
            ...mapGetters('groundwater', ['constantHeadsSelection', 'wellsSelection']),

            ...mapState('groundwater', ['contourMap']),

            constantHeads() {
                return Object.assign({}, this.constantHeadsTrace, this.constantHeadsSelection);
            },

            wells() {
                return Object.assign({}, this.wellsTrace, this.wellsSelection);
            },

            contour() {
                return Object.assign({}, this.contourTrace, {z: this.contourMap});
            },

            traces() {
                return [this.constantHeads, this.wells, this.contour];
            }
        }
    }

    export default GwmOutput;

    ////////////////////////////////////////////////////////////////////////////

    function _componseInitialConstantHeadsTrace() {
        return {
            name: 'C. Head',
            type: 'scatter',
            mode: 'markers',
            x: [],
            y: [],
            marker: {size: 9, color: '1c10ea'},
            showscale: false
        };
    }

    function _componseInitialWellsTrace() {
        return {
            name: 'Well',
            x: [10],
            y: [40],
            type: 'scatter',
            mode: 'markers',
            marker: {size: 9, color: 'f44242'},
            showscale: false
        };
    }

    function _composeContourTrace() {
        return {
            name: 'Contour',
            z: [],
            type: 'contour',
            colorscale: 'YlGnBu',
            colorbar: {
                ypad: 30,
                y: 0.40
            }
        };
    }

    function _composeInitialLayout() {
        return {
            showlegend: true,
            legend: _composeLegend(),
            xaxis: _composeXaxisOptions(),
            yaxis: _composeYaxisOptions(),
            // width: 450,
            // height: 350,
            margin: {l: 50, r: 0, b: 50, t: 25},
            autosize: true
        };
    }

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
            fixedrange: true
        };
    }

    function _composeYaxisOptions() {
        return {
            range: [0, 50],
            nticks: 50,
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
            fixedrange: true
        };
    }
</script>