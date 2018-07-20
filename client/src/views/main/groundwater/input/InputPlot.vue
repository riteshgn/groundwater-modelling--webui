<template>
    <!--Card-->
    <mdb-card :classes="['mb-4']">
        <!-- Card header -->
        <template slot="header">
            <i class="fa fa-bar-chart ml-2"></i>
            Canvas
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
    import { mapGetters } from 'vuex';

    import MdbCard from '../../../../components/MdbCard.vue';
    import PlotlyGraph from '../../../../components/PlotlyGraph.vue';

    import range from 'lodash/range';

    const GwmInput = {
        data() {
            return {
                layout: _composeInitialLayout(),
                constantHeadsTrace: _componseInitialConstantHeadsTrace(),
                wellsTrace: _componseInitialWellsTrace(),
                rechargeTrace: _composeInitialRechargeTrace()
            }
        },

        components: {
            'mdb-card': MdbCard,
            'plotly-graph': PlotlyGraph
        },

        computed: {
            ...mapGetters('groundwater', ['constantHeadsSelection', 'wellsSelection']),

            constantHeads() {
                return Object.assign({}, this.constantHeadsTrace, this.constantHeadsSelection);
            },

            wells() {
                return Object.assign({}, this.wellsTrace, this.wellsSelection);
            },

            traces() {
                return [this.rechargeTrace, this.constantHeads, this.wells];
            }
        }
    };

    export default GwmInput;

    ///////////////////////////////////////////////////////////////////////////////

    function _componseInitialConstantHeadsTrace() {
        return {
            name: 'C. Head',
            type: 'scatter',
            mode: 'markers',
            x: [],
            y: [],
            marker: {size: 9, color: '1c10ea'}
        };
    }

    function _componseInitialWellsTrace() {
        return {
            name: 'Well',
            type: 'scatter',
            mode: 'markers',
            x: [],
            y: [],
            marker: {size: 9, color: 'f44242'}
        };
    }

    function _composeInitialRechargeTrace() {
        return {
            name: 'Recharge',
            type: 'scatter',
            mode: 'markers',
            x: range(0, 50),
            y: Array(50).fill(50),
            marker: {size: 9, color: 'e0f400'}
        }
    }

    function _composeInitialLayout() {
        return {
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
</script>