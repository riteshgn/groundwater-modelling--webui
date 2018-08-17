<template>
    <!--Card-->
    <card class="mb-4">

        <!-- Card header -->
        <card-header class="text-center">
            <i class="fa fa-cog ml-2"></i>
            Configure Model
        </card-header>
        <!-- /.Card header -->

        <!--Card content-->
        <card-body>
            <nav-pills>
                <tab-pane
                    :name="pillNameBasic"
                    :selected="tabSelections.basic"
                    @tab-selected="(selected) => tabSelections.basic = selected">
                    <config-basic></config-basic>
                </tab-pane>
                <tab-pane
                    :name="pillNameConstantHeads"
                    :selected="tabSelections.heads"
                    @tab-selected="(selected) => tabSelections.heads = selected">
                    <config-constant-heads></config-constant-heads>
                </tab-pane>
                <tab-pane
                    :name="pillNameWells"
                    :selected="tabSelections.wells"
                    @tab-selected="(selected) => tabSelections.wells = selected">
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

    import { mapGetters } from 'vuex';
    import { Card, CardBody, CardHeader, Btn } from 'mdbvue';

    import NavPillsVertical from '../../../../components/NavPillsVertical.vue';
    import TabPane from '../../../../components/TabPane.vue';

    import ConfigBasic from './InputRowModelConfigBasic.vue';
    import ConfigConstantHeads from './InputRowModelConfigConstantHeads.vue';
    import ConfigWells from './InputRowModelConfigWells.vue';

    const ModelConfig = {

        data() {
            return {
                tabSelections: {
                    basic: true,
                    heads: false,
                    wells: false
                }
            }
        },

        components: {
            Card,
            CardBody,
            CardHeader,
            Btn,
            'nav-pills': NavPillsVertical,
            'tab-pane': TabPane,
            'config-basic': ConfigBasic,
            'config-constant-heads': ConfigConstantHeads,
            'config-wells': ConfigWells
        },

        computed: {
            ...mapGetters('groundwater', ['basicConfigReady', 'constantHeadsReady', 'wellsReady']),

            pillNameBasic() {
                return 'Basic' + this.requiredIcon(this.basicConfigReady);
            },

            pillNameConstantHeads() {
                return 'Constant Heads' + this.requiredIcon(this.constantHeadsReady);
            },

            pillNameWells() {
                return 'Wells' + this.requiredIcon(this.wellsReady);
            },

            allReady() {
                return this.basicConfigReady && this.constantHeadsReady && this.wellsReady;
            }
        },

        methods: {
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
                this.$log.debug(`Switching the tab to ${tabId}`);
                for (let type in this.tabSelections) {
                    this.tabSelections[type] = type === tabId;
                }
            }
        },

        mounted() {
            this.selectTab('basic');
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