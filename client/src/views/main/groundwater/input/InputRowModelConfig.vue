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
                <tab-pane :name="pillNameBasic" :selected="true">
                    <config-basic></config-basic>
                </tab-pane>
                <tab-pane :name="pillNameConstantHeads">
                    <config-constant-heads></config-constant-heads>
                </tab-pane>
                <tab-pane :name="pillNameWells">
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
                    @click.native="simulate">Simulate</btn>
            </div>
            <!-- Footer -->
        </card-body>
        <!--/.Card content-->

    </card>
    <!--/.Card-->
</template>

<script>

    import { mapGetters, mapActions } from 'vuex';
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
            ...mapActions('groundwater', ['simulate']),

            requiredIcon(ready = false) {
                if (ready)
                    return '';
                return ' <div class="d-inline m-0 p-0 required-pill-asterix"><i class="fa fa-asterisk"></i></div>';
            }
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