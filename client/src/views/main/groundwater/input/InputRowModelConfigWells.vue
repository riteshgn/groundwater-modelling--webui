<template>
    <!-- Default horizontal form -->
    <form>
        <fieldset class="form-group mt-md-3">
            <legend><div class="legend-container">Current Canvas Selections</div></legend>

            <div class="canvas-selections">
                <span v-show="stringifiedWells.length === 0">
                    <small><em class="text-muted">No Selections Available</em></small>
                </span>

                <row class="px-md-2">
                    <canvas-selections
                        :selections="groupOneSelections"
                        @remove-canvas-selection="removeConfig"></canvas-selections>
                    <canvas-selections
                        :selections="groupTwoSelections"
                        @remove-canvas-selection="removeConfig"></canvas-selections>
                    <canvas-selections
                        :selections="groupThreeSelections"
                        @remove-canvas-selection="removeConfig"></canvas-selections>
                </row>
            </div>
        </fieldset>

        <fieldset class="form-group">
            <legend><div class="legend-container">New Canvas Selection</div></legend>

            <!-- Grid row -->
            <row>
                <label class="col-sm-3 col-form-label">X Direction</label>

                <column sm="3">
                    <div class="custom-control custom-checkbox custom-control-inline">
                        <input
                            type="checkbox"
                            class="custom-control-input"
                            id="wells--is-x-a-range"
                            name="wells--is-x-a-range"
                            v-model="plotSelection.x.range">
                        <label class="custom-control-label" for="wells--is-x-a-range">Range?</label>
                    </div>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="wells--x-selection-from"
                        class="form-control form-control-sm"
                        placeholder="From"
                        v-model="plotSelection.x.from">
                    <label class="sr-only" for="wells--x-selection-from">
                        Selection in X direction begins from this cell number
                    </label>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="wells--x-selection-to"
                        class="form-control form-control-sm"
                        placeholder="To"
                        :disabled="!plotSelection.x.range"
                        v-model="plotSelection.x.to">
                    <label class="sr-only" for="wells--x-selection-to">
                        Selection in X direction ends at this cell number
                    </label>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label class="col-sm-3 col-form-label">Y Direction</label>

                <column sm="3">
                    <div class="custom-control custom-checkbox custom-control-inline">
                        <input
                            type="checkbox"
                            class="custom-control-input"
                            id="wells--is-y-a-range"
                            name="wells--is-y-a-range"
                            v-model="plotSelection.y.range">
                        <label class="custom-control-label" for="wells--is-y-a-range">Range?</label>
                    </div>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="wells--y-selection-from"
                        class="form-control form-control-sm"
                        placeholder="From"
                        v-model="plotSelection.y.from">
                    <label class="sr-only" for="wells--y-selection-from">
                        Selection in Y direction begins from this cell number
                    </label>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="wells--y-selection-to"
                        class="form-control form-control-sm"
                        placeholder="To"
                        :disabled="!plotSelection.y.range"
                        v-model="plotSelection.y.to">
                    <label class="sr-only" for="wells--y-selection-to">
                        Selection in Y direction ends at this cell number
                    </label>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label for="wells--selection-value" class="col-sm-3 col-form-label">Value</label>
                <column sm="3">
                    <input
                        type="number"
                        id="wells--selection-value"
                        class="form-control form-control-sm"
                        v-model="plotSelection.value">
                </column>

                <column sm="6">
                    <btn
                        color="primary"
                        size="sm"
                        class="waves-effect"
                        @click.native.prevent="saveConfig">Save</btn>
                    <btn
                        color="outline-primary"
                        size="sm"
                        class="waves-effect"
                        @click.native.prevent="randomize">Randomize</btn>
                </column>
            </row>
            <!-- Grid row -->
        </fieldset>
    </form>
    <!-- Default horizontal form -->
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { Row, Column, Btn } from 'mdbvue';

    import PlotSelection from '../../../../core/PlotSelection';
    import CanvasSelections from './InputRowCanvasSelections.vue';

    const InputConfigWells = {

        data() {
            return {
                plotSelection: new PlotSelection()
            };
        },

        components: {
            Row,
            Column,
            Btn,
            CanvasSelections
        },

        computed: {
            ...mapGetters('groundwater', ['stringifiedWells']),

            groupOneSelections() {
                return this.stringifiedWells.filter((_, index) => index % 3 === 0);
            },

            groupTwoSelections() {
                return this.stringifiedWells.filter((_, index) => index % 3 === 1);
            },

            groupThreeSelections() {
                return this.stringifiedWells.filter((_, index) => index % 3 === 2);
            }
        },

        methods: {
            ...mapMutations({
                removeConfig: 'groundwater/REMOVE_WELLS_CONFIG'
            }),

            saveConfig() {
                this.plotSelection.value = -10000;
                this.$store.commit('groundwater/ADD_WELLS_CONFIG', this.plotSelection.clone());
                this.plotSelection.reset();
            },

            randomize() {
                [
                    { x: {from: 10, range: false}, y: {from: 20, range: false}, value: -10000 },
                    { x: {from: 46, range: false}, y: {from: 40, range: false}, value: -10000 },
                ].forEach(config => {
                    this.$store.commit('groundwater/ADD_WELLS_CONFIG', PlotSelection.make(config));
                });
            }
        },

        mounted() {
            if (!ENV_PRODUCTION)
                this.randomize();
        }

    }

    export default InputConfigWells;

</script>

<style scoped>
    .canvas-selections {
        display: block;
        max-height: 7.5rem;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0.1rem;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    .custom-control-inline {
        padding-top: 0.25rem;
    }

    .custom-control-label {
        font-size: 0.85rem;
        padding-top: 0.2rem;
    }
</style>