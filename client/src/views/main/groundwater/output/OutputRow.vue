<template>
    <div ref="gwm-output" class="row wow fadeIn">
        <!--Grid column-->
        <div class="col-md-6 offset-md-3 mb-4">
            <output-plot></output-plot>
        </div>
        <!--/.Grid column-->
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import scrollIntoView from 'scroll-into-view-if-needed';

    import OutputPlot from './OutputPlot.vue';

    const GwmOutputRow = {
        components: {
            'output-plot': OutputPlot
        },

        computed: {
            ...mapState('groundwater', ['simulationState'])
        },

        watch: {
            simulationState(newValue) {
                if (newValue === 'COMPLETED') {
                    scrollIntoView(this.$refs['gwm-output'], {
                        behavior: 'smooth',
                        scrollMode: 'if-needed',
                        block: 'nearest',
                        inline: 'nearest',
                    });
                }
            }
        }
    };

    export default GwmOutputRow;
</script>