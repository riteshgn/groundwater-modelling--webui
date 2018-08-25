<template>
    <!--Card-->
    <card class="mb-4">

        <!-- Card header -->
        <card-header class="text-center">
            <i class="fa fa-area-chart ml-2" aria-hidden="true"></i>
            Canvas
        </card-header>
        <!-- /.Card header -->

        <!--Card content-->
        <card-body>
            <canvas-summary :show-selection-flag="true"></canvas-summary>

            <plotly-graph
                :traces="traces"
                :layout="layout"
                @p-d3-click="handleClick"></plotly-graph>
        </card-body>
        <!--/.Card content-->

    </card>
    <!--/.Card-->
</template>

<script>

    import { mapGetters, mapState } from 'vuex';
    import { Card, CardBody, CardHeader } from 'mdbvue';

    import PlotlyGraph from '../../../../components/PlotlyGraph.vue';
    import CanvasSummary from './InputRowModelCanvasSummary';

    import CanvasHelper from '../canvas_helper';

    const ModelCanvas = {

        data() {
            return {
                constantHeadsTrace: CanvasHelper.traces.EMPTY_CONSTANT_HEADS,
                wellsTrace: CanvasHelper.traces.EMPTY_WELLS,
                rechargeTrace: CanvasHelper.traces.DEFAULT_RECHARGE_CROSS_SECTIONAL
            }
        },

        components: {
            Card,
            CardBody,
            CardHeader,
            CanvasSummary,
            PlotlyGraph
        },

        computed: {
            ...mapState('app', ['editableCanvas', 'canvasSelectionType', 'tabSelection']),
            ...mapGetters('app', ['selectedConfigurationTab']),
            ...mapGetters('groundwater', ['canvasTitles', 'constantHeadsSelection', 'wellsSelection']),

            layout() {
                const layout = Object.assign({}, CanvasHelper.layoutInput);
                layout.xaxis.title = this.canvasTitles.xAxisTitle;
                layout.yaxis.title = this.canvasTitles.yAxisTitle;

                return layout;
            },

            constantHeads() {
                return Object.assign({}, this.constantHeadsTrace, this.constantHeadsSelection);
            },

            wells() {
                return Object.assign({}, this.wellsTrace, this.wellsSelection);
            },

            traces() {
                return [this.rechargeTrace, this.constantHeads, this.wells];
            }
        },

        methods: {
            canPerformClickActions(coordinates) {
                if (! this.editableCanvas) {
                    this.$log.debug('Canvas is not editable !');
                    return false;
                }

                if ( coordinates.outOfRange.x || coordinates.outOfRange.y ) {
                    this.$log.debug('Click placed outside bound range', JSON.stringify(coordinates.outOfRange));
                    return false;
                }

                return true;
            },

            getPlotSelection(coordinates) {
                return PlotSelection.make({
                    x: {from: coordinates.x, range: false},
                    y: {from: coordinates.y, range: false},
                    value: 20
                });
            },

            handleClick({ coordinates }) {
                this.$log.debug('Received click event');

                if (this.canPerformClickActions(coordinates)) {

                    this.$log.debug('Handling click event');
                    this.$log.debug(`clicked coordinates: ${JSON.stringify(coordinates)}`);
                    this.$bus.$emit('canvas-click-event', { coordinates });

                }
            }
        }

    };

    export default ModelCanvas;

</script>