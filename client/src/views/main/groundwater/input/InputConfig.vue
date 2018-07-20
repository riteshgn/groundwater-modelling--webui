<template>
    <!--Card-->
    <mdb-card
        :classes="['mb-4']"
        :showFooter="true"
        :footerClasses="['text-right']">

        <!-- Card header -->
        <template slot="header">
            <i class="fa fa-cog ml-2"></i>
            Configure Model
        </template>
        <!-- /.Card header -->

        <!--Card content-->
        <template slot="body">
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
        </template>
        <!--/.Card content-->

        <!--Card footer-->
        <template slot="footer">
            <hr />
            <span class="red-text inform-font">
                Enabled when all required ( <span class="badge badge-danger"><i class="fa fa-asterisk"></i></span> ) inputs have been configured
            </span>
            <button type="button"
                class="btn btn-deep-orange waves-effect btn-md"
                @click="simulate">Simulate</button>
        </template>
        <!--/.Card footer-->

    </mdb-card>
    <!--/.Card-->
</template>

<script>
    import { mapActions } from 'vuex';

    import MdbCard from '../../../../components/MdbCard.vue';
    import NavPillsVertical from '../../../../components/NavPillsVertical.vue';
    import TabPane from '../../../../components/TabPane.vue';

    import ConfigBasic from './InputConfigBasic.vue';
    import ConfigConstantHeads from './InputConfigConstantHeads.vue';
    import ConfigWells from './InputConfigWells.vue';

    const PlotConfig = {
        components: {
            'mdb-card': MdbCard,
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

    export default PlotConfig;
</script>

<style scoped>
    .inform-font {
        font-size: 0.6rem;
        font-style: italic;
    }
</style>