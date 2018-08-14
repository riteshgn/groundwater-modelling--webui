<template>
    <section ref="gwm-output" class="my-md-5 py-md-5">
        <!-- Grid row -->
        <row class="pt-md-5">
            <!--Output column-->
            <column md="6" class="mx-auto mb-md-4">
                <simulation-plot></simulation-plot>
            </column>
            <!--/.Output column-->
        </row>
    </section>
</template>

<script>

    import { mapState } from 'vuex';
    import { Row, Column } from 'mdbvue';
    import scrollIntoView from 'scroll-into-view-if-needed';

    import SimulationPlot from './OutputRowSimulationPlot.vue';

    const GwmOutputRow = {
        components: {
            Row,
            Column,
            SimulationPlot
        },

        computed: {
            ...mapState('groundwater', ['simulationState'])
        },

        methods: {
            scrollToMe() {
                scrollIntoView(this.$refs['gwm-output'], {
                    behavior: 'smooth',
                    scrollMode: 'if-needed',
                    block: 'start',
                    inline: 'start',
                });
            }
        },

        created() {
            this.$bus.$on('app-display-output', this.scrollToMe);
        }
    };

    export default GwmOutputRow;
</script>