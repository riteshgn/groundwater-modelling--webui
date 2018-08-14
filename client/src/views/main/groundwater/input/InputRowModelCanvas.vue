<template>
    <!--Card-->
    <card class="mb-4">

        <!-- Card header -->
        <card-header class="text-center">
            <i class="fa fa-bar-chart ml-2"></i>
            Canvas
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
            PlotlyGraph
        },

        computed: {
            ...mapGetters('groundwater', ['canvasTitles', 'constantHeadsSelection', 'wellsSelection']),

            layout() {
                const layout = Object.assign({}, CanvasHelper.layoutInput);
                layout.title = this.canvasTitles.mainTitle
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
        }
    };

    export default ModelCanvas;

</script>