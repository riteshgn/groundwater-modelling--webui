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
                            ref="config-basic-model-layout-radio-map"
                            type="radio"
                            class="custom-control-input"
                            id="layout-style-map"
                            name="layout"
                            value="map"
                            :checked="modelLayout === 'map'"
                            @input="updateLayout('map')">
                        <label class="custom-control-label" for="layout-style-map">Map</label>
                    </div>

                    <div class="custom-control custom-radio custom-control-inline">
                        <input
                            type="radio"
                            class="custom-control-input"
                            id="layout-style-cross-section"
                            name="layout"
                            value="cross_section"
                            :checked="modelLayout === 'cross_section'"
                            @input="updateLayout('cross_section')">
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
                            :value="row.width"
                            @input="updateRowWidth(parseInt($event.target.value, 10))">
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
                            :value="column.width"
                            @input="updateColumnWidth(parseInt($event.target.value, 10))">
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
                            :value="gridThickness"
                            :disabled="gridThicknessDisabled"
                            @input="updateGridThickness(parseInt($event.target.value, 10))">
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
                <label for="recharge-volume" class="col-sm-3 col-form-label">Volume (m<sup>3</sup>)</label>
                <column sm="3">
                    <input
                        type="number"
                        class="form-control form-control-sm"
                        id="recharge-volume"
                        :value="recharge.volume"
                        @input="updateRechargeVolume(parseFloat($event.target.value))">
                </column>

                <label for="recharge-days" class="col-sm-3 col-form-label">Period (Days)</label>
                <column sm="3">
                    <input
                        type="number"
                        id="recharge-days"
                        class="form-control form-control-sm"
                        :value="recharge.days"
                        @input="updateRechargePeriod(parseInt($event.target.value, 10))">
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
                    <select
                        name="soil-type"
                        id="soil-type"
                        class="browser-default w-100 form-control form-control-sm"
                        @input="updateSoilType($event.target.value)">
                        <option
                            v-for="soilType in soilTypes"
                            :key="soilType.id"
                            :value="soilType.id"
                            :selected="soilType.selected">
                            {{ soilType.name }}
                        </option>
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
    import { numeric, decimal } from 'vuelidate/lib/validators';

    const ConfigBasic = {

        data() {
            return  {
                prevGridThickness: -1,

                soilTypes: [
                    { id: 'gravel', name: 'Gravel', selected: false  },
                    { id: 'sand', name: 'Sand', selected: false  },
                    { id: 'silt', name: 'Silt', selected: false  },
                    { id: 'clay', name: 'Clay', selected: false  },
                    { id: 'random', name: 'Randomized', selected: false  }
                ]
            }
        },

        components: {
            Row,
            Column
        },

        computed: {
            ...mapState('groundwater', ['row', 'column', 'recharge',
                'gridThickness', 'modelLayout', 'soilType']),

            gridThicknessDisabled() {
                return this.modelLayout === 'cross_section';
            }
        },

        validations: {
            row: {
                width: { numeric }
            },

            column: {
                width: { numeric }
            },

            gridThickness: { numeric },

            recharge: {
                volume: { decimal },

                days: { numeric }
            }
        },

        methods: {
            updateRowWidth(newValue) {
                this.$store.commit('groundwater/UPDATE_ROW_WIDTH', newValue);
                this.$v.row.width.$touch();
                if (!this.$v.row.width.numeric) {
                    this.showErrorToaster('Row width must be a valid positive integer');
                }
            },

            updateColumnWidth(newValue) {
                this.$store.commit('groundwater/UPDATE_COLUMN_WIDTH', newValue);
                this.$v.column.width.$touch();
                if (!this.$v.column.width.numeric) {
                    this.showErrorToaster('Column width must be a valid positive integer');
                }
            },

            updateGridThickness(newValue) {
                this.$store.commit('groundwater/UPDATE_GRID_THICKNESS', newValue);
                this.$v.gridThickness.$touch();
                if (!this.$v.gridThickness.numeric) {
                    this.showErrorToaster('Grid Thickness must be a valid positive integer');
                }
            },

            updateRechargeVolume(newValue) {
                this.$store.commit('groundwater/UPDATE_RECHARGE_VOLUME', newValue);
                this.$v.recharge.volume.$touch();
                if (!this.$v.recharge.volume.decimal) {
                    this.showErrorToaster('Recharge volume must be a valid positive decimal number');
                }
            },

            updateRechargePeriod(newValue) {
                this.$store.commit('groundwater/UPDATE_RECHARGE_PERIOD', newValue);
                this.$v.recharge.days.$touch();
                if (!this.$v.recharge.days.numeric) {
                    this.showErrorToaster('Recharge Period must be a valid positive integer');
                }
            },

            updateLayout(newValue) {
                this.$store.commit('groundwater/UPDATE_MODEL_LAYOUT', newValue);

                // grid thickness is set to 1 by default when 'cross section' is selected
                // ensure to cache the user entered value for thickness when
                // the radio button is flipped so that when 'map' view is selected the
                // cached entry can be displayed back to the user
                if (newValue === 'cross_section') {
                    this.prevGridThickness = this.$store.state.groundwater.gridThickness;
                    this.$store.commit('groundwater/UPDATE_GRID_THICKNESS', 1);
                } else if (this.prevGridThickness !== -1) {
                    this.$store.commit('groundwater/UPDATE_GRID_THICKNESS', this.prevGridThickness);
                }
            },

            updateSoilType(newValue) {
                this.$store.commit('groundwater/UPDATE_SOIL_TYPE', newValue);
                this.setSoilTypeSelection();
            },

            setSoilTypeSelection() {
                this.soilTypes.forEach(soilType => soilType.selected = soilType.id === this.soilType);
            },

            showErrorToaster(message) {
                const options = {
                    type: 'error',
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-right',
                    action: [{
                        text: 'ok',
                        onClick : (e, toastObject) => {
                            toastObject.goAway(0);
                        }
                    }]
                };

                this.$toasted.show(message, options);
            }
        },

        created() {
            // set the default selection for the soil type dropdown
            this.setSoilTypeSelection();
            this.$bus.$on('app-start-modelling', this.setSoilTypeSelection);
        },

        mounted() {
            this.$refs['config-basic-model-layout-radio-map'].focus();
        }

    }

    export default ConfigBasic;

</script>

<style scoped>
    .custom-control-label {
        font-size: 0.85rem;
    }
</style>