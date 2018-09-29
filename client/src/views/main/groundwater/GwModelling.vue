<template>
    <!-- Section -->
    <section
        id="gw-modelling"
        ref="gw-modelling"
        class="my-md-5 py-md-5">

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

        methods: {
            scrollToMe() {
                this.$log.debug('scrolling to configure model section...');

                scrollIntoView(this.$refs['gw-modelling'], {
                    behavior: 'smooth',
                    scrollMode: 'if-needed',
                    block: 'start',
                    inline: 'start',
                });
            }
        },

        mounted() {
            this.scrollToMe();
            this.$log.debug('GwModelling.vue | mounted | registering callback to app-start-modelling event...');
            this.$bus.$on('app-start-modelling', this.scrollToMe);
        }

    }

    export default GwModelling;

</script>