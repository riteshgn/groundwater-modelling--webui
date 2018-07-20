<template>
    <div ref="gw-modelling" class="row wow fadeIn">
        <!--Grid column-->
        <div class="col-md-12 mb-4">
            <gwm-input-row></gwm-input-row>
            <gwm-output-row v-show="showOutput"></gwm-output-row>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import scrollIntoView from 'scroll-into-view-if-needed';

    import GwmInputRow from './input/InputRow.vue';
    import GwmOutputRow from './output/OutputRow.vue';

    const GwmModelling = {
        components: {
            'gwm-input-row': GwmInputRow,
            'gwm-output-row': GwmOutputRow
        },

        computed: {
            ...mapState('groundwater', ['showOutput'])
        },

        mounted() {
            scrollIntoView(this.$refs['gw-modelling'], {
                behavior: 'smooth',
                scrollMode: 'if-needed',
                block: 'end',
                inline: 'end',
            });
        }
    }

    export default GwmModelling;
</script>