<template>
    <!--Card-->
    <card class="mb-4">

        <!-- Card header -->
        <card-header class="text-center">
            <i class="fa fa-hand-spock-o ml-2" aria-hidden="true"></i>
            Heads
        </card-header>
        <!-- /.Card header -->

        <!--Card content-->
        <card-body>
            <canvas-summary></canvas-summary>

            <plotly-graph
                :traces="traces"
                :layout="layout"></plotly-graph>
        </card-body>
        <!--/.Card content-->

    </card>
    <!--/.Card-->
</template>

<script>

    import { mapGetters, mapState } from 'vuex';
    import { Card, CardBody, CardHeader } from 'mdbvue';

    import PlotlyGraph from '../../../../components/PlotlyGraph.vue';
    import CanvasSummary from '../input/InputRowModelCanvasSummary';

    import CanvasHelper from '../canvas_helper';

    const SimulationPlot = {

        data() {
            return {
                displayedConstantHeadsSelection: CanvasHelper.traces.EMPTY_CONSTANT_HEADS,
                displayedWellsSelection: CanvasHelper.traces.EMPTY_WELLS,
                displayedContourMap: CanvasHelper.traces.EMPTY_CONTOUR
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
            ...mapGetters('groundwater', ['canvasTitles', 'constantHeadsSelection', 'wellsSelection']),

            ...mapState('groundwater', ['contourMap', 'quiver']),

            layout() {
                const layout = Object.assign({}, CanvasHelper.layoutOutput);
                layout.xaxis.title = this.canvasTitles.xAxisTitle;
                layout.yaxis.title = this.canvasTitles.yAxisTitle;

                return layout;
            },

            constantHeadsTrace() {
                return Object.assign({}, this.displayedConstantHeadsSelection, this.constantHeadsSelection);
            },

            wellsTrace() {
                return Object.assign({}, this.displayedWellsSelection, this.wellsSelection);
            },

            contourTrace() {
                return Object.assign({}, this.displayedContourMap, {z: this.contourMap});
            },

            traces() {
                return [this.constantHeadsTrace, this.wellsTrace, this.contourTrace];
            }

        }

    }

    export default SimulationPlot;

</script>