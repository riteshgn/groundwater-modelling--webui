<template>
    <!-- Section -->
    <section
        id="gw-modelling"
        ref="gw-modelling"
        class="py-md-4">

        <gwm-input-row></gwm-input-row>
        <gwm-output-row v-show="showOutput"></gwm-output-row>

    </section>
    <!-- Section -->
</template>

<script>

    import { mapState } from 'vuex';
    import scrollIntoView from 'scroll-into-view-if-needed';

    import GwmInputRow from './input/InputRow.vue';
    import GwmOutputRow from './output/OutputRow.vue';

    const GwModelling = {

        components: {
            GwmInputRow,
            GwmOutputRow
        },

        computed: {
            ...mapState('groundwater', ['showOutput'])
        },

        mounted() {
            scrollIntoView(this.$refs['gw-modelling'], {
                behavior: 'smooth',
                scrollMode: 'if-needed',
                block: 'center',
                inline: 'center',
            });
        }

    }

    export default GwModelling;

</script>