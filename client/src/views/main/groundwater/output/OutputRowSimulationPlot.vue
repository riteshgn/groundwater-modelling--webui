<template>
    <!--Card-->
    <card class="mb-4">

        <!-- Card header -->
        <card-header class="text-center">
            Heads & Flow Vectors (Map View)
        </card-header>
        <!-- /.Card header -->

        <!--Card content-->
        <card-body>
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

    import CanvasHelper from '../canvas_helper';

    const SimulationPlot = {

        data() {
            return {
                layout: CanvasHelper.layoutOutput,
                constantHeadsTrace: CanvasHelper.traces.EMPTY_CONSTANT_HEADS,
                wellsTrace: CanvasHelper.traces.EMPTY_WELLS,
                contourTrace: CanvasHelper.traces.EMPTY_CONTOUR
            }
        },

        components: {
            Card,
            CardBody,
            CardHeader,
            PlotlyGraph
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

    export default SimulationPlot;

</script>