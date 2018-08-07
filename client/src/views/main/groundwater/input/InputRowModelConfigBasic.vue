<template>
    <!-- Default horizontal form -->
    <form>
        <fieldset class="form-group">
            <legend><div class="legend-container">Layout & Dimensions</div></legend>

            <!-- Grid row -->
            <row>
                <label for="layout" class="col-sm-3 col-form-label">Model Layout</label>
                <column sm="9">
                    <div class="custom-control custom-radio custom-control-inline">
                        <input
                            type="radio"
                            class="custom-control-input"
                            id="layout-style-map"
                            name="layout"
                            checked>
                        <label class="custom-control-label" for="layout-style-map">Map</label>
                    </div>

                    <div class="custom-control custom-radio custom-control-inline">
                        <input
                            type="radio"
                            class="custom-control-input"
                            id="layout-style-cross-section"
                            name="layout">
                        <label class="custom-control-label" for="layout-style-cross-section">Cross Section</label>
                    </div>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label for="no-of-rows" class="col-sm-3 col-form-label">Rows</label>
                <column sm="3">
                    <input
                        type="number"
                        id="no-of-rows"
                        class="form-control form-control-sm"
                        v-model="row.count"
                        disabled>
                </column>

                <label for="row-width" class="col-sm-3 col-form-label">Row Width</label>
                <column sm="3">
                    <div class="input-group input-group-sm" title="Row width in meters">
                        <input
                            type="number"
                            class="form-control"
                            id="row-width"
                            v-model="row.width"
                            disabled>
                        <div class="input-group-append">
                            <span class="input-group-text" id="row-width-units">m</span>
                        </div>
                    </div>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label for="no-of-cols" class="col-sm-3 col-form-label">Columns</label>
                <column sm="3">
                    <input
                        type="number"
                        id="no-of-cols"
                        class="form-control form-control-sm"
                        v-model="column.count"
                        disabled>
                </column>

                <label for="col-width" class="col-sm-3 col-form-label">Column Width</label>
                <column sm="3">
                    <div class="input-group input-group-sm" title="Column width in meters">
                        <input
                            type="number"
                            class="form-control"
                            id="col-width"
                            v-model="column.width"
                            disabled>
                        <div class="input-group-append">
                            <span class="input-group-text" id="col-width-units">m</span>
                        </div>
                    </div>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label for="grid-thickness" class="col-sm-3 col-form-label ml-auto">Grid Thickness</label>
                <column sm="3">
                    <div class="input-group input-group-sm" title="Thickness in meters">
                        <input
                            type="number"
                            class="form-control"
                            id="grid-thickness"
                            v-model="gridThickness"
                            disabled>
                        <div class="input-group-append">
                            <span class="input-group-text" id="grid-thickness-units">m</span>
                        </div>
                    </div>
                </column>
            </row>
            <!-- Grid row -->
        </fieldset>

        <fieldset class="form-group">
            <legend><div class="legend-container">Recharge</div></legend>

            <!-- Grid row -->
            <row>
                <label for="recharge-volume" class="col-sm-3 col-form-label">Volume</label>
                <column sm="3">
                    <div class="input-group input-group-sm" title="Recharge volume in meter cubed">
                        <input
                            type="number"
                            class="form-control"
                            id="recharge-volume"
                            v-model="recharge.volume">
                        <div class="input-group-append">
                            <span class="input-group-text" id="recharge-volume-units">m<sup>3</sup></span>
                        </div>
                    </div>
                </column>

                <label for="recharge-days" class="col-sm-3 col-form-label">Period (Days)</label>
                <column sm="3">
                    <input
                        type="number"
                        id="recharge-days"
                        class="form-control form-control-sm"
                        v-model="recharge.days">
                </column>
            </row>
            <!-- Grid row -->
        </fieldset>

        <fieldset class="form-group">
            <legend><div class="legend-container">Soil</div></legend>

            <!-- Grid row -->
            <row class="form-group">
                <label for="soil-type" class="col-sm-3 col-form-label">Soil Type</label>
                <column sm="9">
                    <select name="soil-type" id="soil-type" class="browser-default w-100 form-control form-control-sm">
                        <option value="gravel">Gravel</option>
                        <option value="sand">Sand</option>
                        <option value="silt">Silt</option>
                        <option value="clay">Clay</option>
                        <option value="random" selected>Randomize</option>
                    </select>
                </column>
            </row>
            <!-- Grid row -->
        </fieldset>

    </form>
</template>

<script>

    import { Row, Column } from 'mdbvue';
    import { mapState } from 'vuex';

    const ConfigBasic = {

        components: {
            Row,
            Column
        },

        computed: {
            ...mapState('groundwater', ['row', 'column', 'recharge', 'gridThickness'])
        }

    }

    export default ConfigBasic;

</script>

<style scoped>
    .custom-control-label {
        font-size: 0.85rem;
    }
</style>