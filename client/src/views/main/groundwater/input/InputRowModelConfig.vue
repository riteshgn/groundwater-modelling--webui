<template>
    <!--Card-->
    <card class="mb-4">

        <!-- Card header -->
        <card-header class="text-center">
            <i class="fa fa-cog ml-2" aria-hidden="true"></i>
            Configure Model
        </card-header>
        <!-- /.Card header -->

        <!--Card content-->
        <card-body>
            <nav-pills>
                <tab-pane
                    :name="pillNameBasic"
                    :selected="tabSelection.basic"
                    @tab-selected="SET_TAB_SELECTION_BASIC">
                    <config-basic></config-basic>
                </tab-pane>
                <tab-pane
                    :name="pillNameConstantHeads"
                    :selected="tabSelection.heads"
                    @tab-selected="SET_TAB_SELECTION_HEADS">
                    <config-constant-heads></config-constant-heads>
                </tab-pane>
                <tab-pane
                    :name="pillNameWells"
                    :selected="tabSelection.wells"
                    @tab-selected="SET_TAB_SELECTION_WELLS">
                    <config-wells></config-wells>
                </tab-pane>
            </nav-pills>

            <!-- Footer -->
            <div class="text-right">
                <hr />

                <span class="inform-font">
                    <small>Enabled when all required ( <span v-html="requiredIcon()"></span> ) inputs have been configured</small>
                </span>

                <btn
                    color="deep-orange"
                    size="md"
                    class="waves-effect"
                    :disabled="!allReady"
                    aria-label="Simulate"
                    aria-describedby="descriptionSimulate"
                    @click.native="simulate">Simulate</btn>

                <div
                    id="descriptionSimulate"
                    class="sr-only">
                    Clicking the "Simulate" button will execute the configured groundwater-model. The simulation output will be visible and the main view will automatically scroll to the output section.
                </div>
            </div>
            <!-- Footer -->
        </card-body>
        <!--/.Card content-->

    </card>
    <!--/.Card-->
</template>

<script>

    import { mapGetters, mapState, mapMutations } from 'vuex';
    import { Card, CardBody, CardHeader, Btn } from 'mdbvue';

    import NavPillsVertical from '../../../../components/NavPillsVertical.vue';
    import TabPane from '../../../../components/TabPane.vue';

    import ConfigBasic from './InputRowModelConfigBasic.vue';
    import ConfigConstantHeads from './InputRowModelConfigConstantHeads.vue';
    import ConfigWells from './InputRowModelConfigWells.vue';

    const ModelConfig = {

        components: {
            Card,
            CardBody,
            CardHeader,
            Btn,
            'nav-pills': NavPillsVertical,
            TabPane,
            ConfigBasic,
            ConfigConstantHeads,
            ConfigWells
        },

        computed: {
            ...mapState('app', ['tabSelection']),
            ...mapGetters('groundwater', ['basicConfigReady', 'constantHeadsReady', 'wellsReady']),

            eitherHeadsOrWellsIsReady() {
                return this.constantHeadsReady || this.wellsReady;
            },

            pillNameBasic() {
                return 'Basic' + this.requiredIcon(this.basicConfigReady);
            },

            pillNameConstantHeads() {
                return 'Constant Heads' + this.requiredIcon(this.eitherHeadsOrWellsIsReady);
            },

            pillNameWells() {
                return 'Wells' + this.requiredIcon(this.eitherHeadsOrWellsIsReady);
            },

            allReady() {
                return this.basicConfigReady && this.eitherHeadsOrWellsIsReady;
            }
        },

        methods: {
            ...mapMutations('app', [
                'SET_TAB_SELECTION_BASIC',
                'SET_TAB_SELECTION_HEADS',
                'SET_TAB_SELECTION_WELLS'
            ]),

            async simulate() {
                await this.$store.dispatch('groundwater/simulate');
                this.$bus.$emit('app-display-output', {sender: 'InputRowModelConfig.vue'});
            },

            requiredIcon(ready = false) {
                if (ready)
                    return '';
                return ' <div class="d-inline m-0 p-0 required-pill-asterix"><i class="fa fa-asterisk"></i></div>';
            },

            selectTab(tabId) {
                for (let type in this.tabSelections) {
                    this.tabSelections[type] = type === tabId;
                }
            }
        },

        mounted() {
            this.selectTab('basic');
            this.$log.debug(
                'InputRowModelConfig.vue | mounted | registering callback to app-start-modelling event...');
            this.$bus.$on('app-start-modelling', () => this.selectTab('basic'));
        }

    }

    export default ModelConfig;

</script>

<style scoped>
    .inform-font {
        font-size: 0.85rem;
        /*font-style: italic;*/
        color: #e72400;
    }
</style>