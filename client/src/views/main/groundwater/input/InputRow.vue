<template>
    <div class="row wow fadeIn">
        <!--Grid column-->
        <div class="col-md-6 mb-4">
            <input-config></input-config>
        </div>
        <!--/.Grid column-->

        <!--Grid column-->
        <div class="col-md-6 mb-4">
            <input-plot></input-plot>
        </div>
        <!--/.Grid column-->
    </div>
</template>

<script>
    import InputPlot from './InputPlot.vue';
    import InputConfig from './InputConfig.vue';

    import __ from 'lodash';

    const GwmInputRow = {
        components: {
            'input-plot': InputPlot,
            'input-config': InputConfig
        }
    };

    export default GwmInputRow;
</script>