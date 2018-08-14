<template>
    <!-- Grid row -->
    <row class="pt-md-5">
        <!--Model Configuration column-->
        <column md="6">
            <model-config></model-config>
        </column>
        <!--/.Model Configuration column-->

        <!--Canvas column-->
        <column md="6">
            <model-canvas></model-canvas>
        </column>
        <!--/.Canvas column-->
    </row>
    <!-- Grid row -->
</template>

<script>

    import { Row, Column } from 'mdbvue';

    import ModelCanvas from './InputRowModelCanvas.vue';
    import ModelConfig from './InputRowModelConfig.vue';

    const GwmInputRow = {

        components: {
            Row,
            Column,
            ModelCanvas,
            ModelConfig
        }

    };

    export default GwmInputRow;

</script>