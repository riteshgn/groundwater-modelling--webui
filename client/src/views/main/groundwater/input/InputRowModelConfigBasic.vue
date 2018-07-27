<template>
    <!-- Default horizontal form -->
    <form>
        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-5">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="no-of-rows">rows</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        v-model="row.count"
                        disabled>
                </div>
            </div>

            <div class="col-sm-6">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="row-width">row-width</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        v-model="row.width"
                        disabled>
                </div>
            </div>
        </div>
        <!-- Grid row -->

        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-5">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="no-of-cols">cols&nbsp;</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        v-model="column.count"
                        disabled>
                </div>
            </div>

            <div class="col-sm-6">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="col-width">col-width&nbsp;</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        v-model="column.width"
                        disabled>
                </div>
            </div>
        </div>
        <!-- Grid row -->

        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-11">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="no-of-rows">Recharge Rate</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        v-model="rechargeRate">
                </div>
            </div>
        </div>
        <!-- Grid row -->

        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-12">
                <!-- Default inline 1-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="defaultInline1" name="inlineDefaultRadiosExample">
                    <label class="custom-control-label" for="defaultInline1">Gravel</label>
                </div>

                <!-- Default inline 2-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="defaultInline2" name="inlineDefaultRadiosExample">
                    <label class="custom-control-label" for="defaultInline2">Sand</label>
                </div>

                <!-- Default inline 3-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="defaultInline3" name="inlineDefaultRadiosExample">
                    <label class="custom-control-label" for="defaultInline3">Silt</label>
                </div>

                <!-- Default inline 4-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="defaultInline4" name="inlineDefaultRadiosExample">
                    <label class="custom-control-label" for="defaultInline4">Clay</label>
                </div>

                <!-- Default inline 5-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="defaultInline5" name="inlineDefaultRadiosExample" checked>
                    <label class="custom-control-label" for="defaultInline5">Randomize</label>
                </div>
            </div>
        </div>
        <!-- Grid row -->

    </form>
</template>

<script>

    import { mapState } from 'vuex';

    const ConfigBasic = {

        computed: {
            ...mapState('groundwater', ['row', 'column', 'rechargeRate'])
        }

    }

    export default ConfigBasic;

</script>

<style scoped>
    .custom-control-label {
        font-size: 0.75rem;
        margin-top: 0.2rem;
    }
</style>