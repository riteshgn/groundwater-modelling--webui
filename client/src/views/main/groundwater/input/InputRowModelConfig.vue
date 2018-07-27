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
                <tab-pane name="Basic" :selected="true">
                    <config-basic></config-basic>
                </tab-pane>
                <tab-pane name="Constant Heads">
                    <config-constant-heads></config-constant-heads>
                </tab-pane>
                <tab-pane name="Wells">
                    <config-wells></config-wells>
                </tab-pane>
            </nav-pills>

            <!-- Footer -->
            <div class="text-right">
                <hr />

                <span class="red-text">
                    <small>Enabled when all required ( <span class="badge badge-danger"><i class="fa fa-asterisk"></i></span> ) inputs have been configured</small>
                </span>

                <btn
                    color="deep-orange"
                    size="md"
                    class="waves-effect"
                    @click.native="simulate">Simulate</btn>
            </div>
            <!-- Footer -->
        </card-body>
        <!--/.Card content-->

    </card>
    <!--/.Card-->
</template>

<script>

    import { mapActions } from 'vuex';
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

        methods: {
            ...mapActions('groundwater', ['simulate'])
        }

    }

    export default ModelConfig;

</script>

<style scoped>
    .inform-font {
        font-size: 0.6rem;
        font-style: italic;
    }
</style>