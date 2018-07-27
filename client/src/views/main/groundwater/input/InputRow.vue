<template>
    <!-- Grid row -->
    <row class="mt-md-5 pt-md-5">
        <!--Model Configuration column-->
        <column md="6" class="mt-md-5">
            <model-config></model-config>
        </column>
        <!--/.Model Configuration column-->

        <!--Canvas column-->
        <column md="6" class="mt-md-5">
            <model-canvas></model-canvas>
        </column>
        <!--/.Canvas column-->
    </row>
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