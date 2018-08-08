<template>
    <!-- Default horizontal form -->
    <form>
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
                            id="is-x-a-range"
                            name="is-x-a-range"
                            v-model="plotSelection.x.range">
                        <label class="custom-control-label" for="is-x-a-range">Range?</label>
                    </div>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="x-selection-from"
                        class="form-control form-control-sm"
                        placeholder="From"
                        v-model="plotSelection.x.from">
                    <label class="sr-only" for="x-selection-from">
                        Selection in X direction begins from this cell number
                    </label>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="x-selection-to"
                        class="form-control form-control-sm"
                        placeholder="To"
                        :disabled="!plotSelection.x.range"
                        v-model="plotSelection.x.to">
                    <label class="sr-only" for="x-selection-to">
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
                            id="is-y-a-range"
                            name="is-y-a-range"
                            v-model="plotSelection.y.range">
                        <label class="custom-control-label" for="is-y-a-range">Range?</label>
                    </div>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="y-selection-from"
                        class="form-control form-control-sm"
                        placeholder="From"
                        v-model="plotSelection.y.from">
                    <label class="sr-only" for="y-selection-from">
                        Selection in Y direction begins from this cell number
                    </label>
                </column>

                <column sm="3">
                    <input
                        type="number"
                        id="y-selection-to"
                        class="form-control form-control-sm"
                        placeholder="To"
                        :disabled="!plotSelection.y.range"
                        v-model="plotSelection.y.to">
                    <label class="sr-only" for="y-selection-to">
                        Selection in Y direction ends at this cell number
                    </label>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label for="selection-value" class="col-sm-3 col-form-label">Value</label>
                <column sm="3">
                    <input
                        type="number"
                        id="selection-value"
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

        <fieldset class="form-group mt-md-3">
            <legend><div class="legend-container">Current Canvas Selections</div></legend>

            <div class="canvas-selections">
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
    </form>
    <!-- Default horizontal form -->
</template>

<script>

    import { mapGetters, mapMutations } from 'vuex';
    import { Row, Column, Btn } from 'mdbvue';

    import PlotSelection from '../../../../core/PlotSelection';
    import CanvasSelections from './InputRowCanvasSelections.vue';

    const ConfigConstantHeads = {

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
            ...mapGetters('groundwater', ['stringifiedHeads']),

            groupOneSelections() {
                return this.stringifiedHeads.filter((_, index) => index % 3 === 0);
            },

            groupTwoSelections() {
                return this.stringifiedHeads.filter((_, index) => index % 3 === 1);
            },

            groupThreeSelections() {
                return this.stringifiedHeads.filter((_, index) => index % 3 === 2);
            }
        },

        methods: {
            ...mapMutations({
                removeConfig: 'groundwater/REMOVE_CONSTANT_HEAD_CONFIG'
            }),

            saveConfig() {
                this.$store.commit('groundwater/ADD_CONSTANT_HEAD_CONFIG', this.plotSelection.clone());
                this.plotSelection.reset();
            },

            randomize() {
                [
                    { x: {from: 0, to: 20, range: true}, y: {from: 5, range: false}, value: 20 },
                    { x: {from: 20, range: false}, y: {from: 6, to: 14, range: true}, value: 20 },
                    { x: {from: 21, to: 50, range: true}, y: {from: 14, range: false}, value: 20 },
                ].forEach(config => {
                    this.$store.commit('groundwater/ADD_CONSTANT_HEAD_CONFIG', PlotSelection.make(config));
                });
            }
        },

        mounted() {
            if (!ENV_PRODUCTION)
                this.randomize();
        }

    }

    export default ConfigConstantHeads;

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