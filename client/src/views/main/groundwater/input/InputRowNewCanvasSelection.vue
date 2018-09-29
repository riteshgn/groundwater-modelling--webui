<template>
    <form>
        <fieldset class="form-group">
            <legend><div class="legend-container">New Canvas Selection</div></legend>

            <!-- Grid row -->
            <row>
                <column sm="6">
                    <div class="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            class="custom-control-input"
                            id="new-canvas-selection--checkbox-editable-canvas"
                            :checked="editableCanvas"
                            @input="MAKE_CANVAS_EDITABLE($event.target.checked)">

                        <label
                            class="custom-control-label enable-check-box-label"
                            for="new-canvas-selection--checkbox-editable-canvas">
                            Enable selection on Canvas?
                        </label>
                    </div>
                </column>
            </row>

            <row>
                <label
                    for="new-canvas-selection--select-selection-type"
                    class="col-sm-3 col-form-label">
                    Selection Type
                </label>

                <column sm="8">
                    <select
                        name="new-canvas-selection--select-selection-type"
                        id="new-canvas-selection--select-selection-type"
                        class="browser-default w-100 form-control form-control-sm"
                        @input="updateCanvasSelectionType($event.target.value)">
                        <option
                            v-for="selectionType in canvasSelectionTypes"
                            :key="selectionType.id"
                            :value="selectionType.id"
                            :selected="selectionType.selected">
                            {{ selectionType.name }}
                        </option>
                    </select>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label class="col-sm-3 col-form-label">X Direction</label>

                <column sm="4">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">From</span>
                        </div>
                        <input
                            type="number"
                            id="new-canvas-selection--x-selection-from"
                            class="form-control"
                            placeholder="From"
                            v-model.number="$v.plotSelection.x.from.$model"
                            @input="engagePreview(plotSelection)">
                        <label class="sr-only" for="new-canvas-selection--x-selection-from">
                            Selection in X direction begins from this cell number
                        </label>
                    </div>
                </column>

                <column sm="4">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">To</span>
                        </div>
                        <input
                            type="number"
                            id="new-canvas-selection--x-selection-to"
                            class="form-control form-control-sm"
                            placeholder="To"
                            :disabled="!plotSelection.x.range"
                            v-model.number="$v.plotSelection.x.to.$model"
                            @input="engagePreview(plotSelection)">
                        <label class="sr-only" for="new-canvas-selection--x-selection-to">
                            Selection in X direction ends at this cell number
                        </label>
                    </div>
                </column>
            </row>
            <!-- Grid row -->

            <!-- Grid row -->
            <row>
                <label class="col-sm-3 col-form-label">Y Direction</label>

                <column sm="4">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">From</span>
                        </div>
                        <input
                            type="number"
                            id="new-canvas-selection--y-selection-from"
                            class="form-control form-control-sm"
                            placeholder="From"
                            v-model.number="$v.plotSelection.y.from.$model"
                            @input="engagePreview(plotSelection)">
                        <label class="sr-only" for="new-canvas-selection--y-selection-from">
                            Selection in Y direction begins from this cell number
                        </label>
                    </div>
                </column>

                <column sm="4">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">To</span>
                        </div>
                        <input
                            type="number"
                            id="new-canvas-selection--y-selection-to"
                            class="form-control form-control-sm"
                            placeholder="To"
                            :disabled="!plotSelection.y.range"
                            v-model.number="$v.plotSelection.y.to.$model"
                            @input="engagePreview(plotSelection)">
                        <label class="sr-only" for="new-canvas-selection--y-selection-to">
                            Selection in Y direction ends at this cell number
                        </label>
                    </div>
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
                        v-model.number="$v.plotSelection.value.$model">
                </column>

                <column sm="6">
                    <btn
                        outline="primary"
                        size="sm"
                        class="waves-effect"
                        aria-label="ResetSelection"
                        aria-describedby="descriptionResetSelection"
                        @click.native.prevent="resetForm">Reset</btn>
                    <div
                        id="descriptionResetSelection"
                        class="sr-only">
                        Clicking the "Reset" button any changes to the x & y directional selection and corresponding value for {{ tabName }} will be reset to their default values.
                    </div>
                    <btn
                        color="primary"
                        size="sm"
                        class="waves-effect"
                        aria-label="SaveSelection"
                        aria-describedby="descriptionSaveSelection"
                        @click.native.prevent="saveConfig">Save</btn>
                    <div
                        id="descriptionSaveSelection"
                        class="sr-only">
                        Clicking the "Save" button adds the x & y directional selection and corresponding value for {{ tabName }} to the model canvas.
                    </div>
                </column>
            </row>
            <!-- Grid row -->

        </fieldset>
    </form>
</template>

<script>

    import { mapState, mapGetters, mapMutations } from 'vuex';
    import { Row, Column, Btn } from 'mdbvue';

    import PlotSelection from '../../../../core/PlotSelection';
    import NewCanvasSelectionFormMixin from '../../../../mixins/NewCanvasSelectionFormMixin';

    const NewCanvasSelection = {

        mixins: [NewCanvasSelectionFormMixin],

        props: {
            tabName: { type: String, required: true }
        },

        data() {
            return {
                canvasSelectionTypes: [
                    { id: 'POINT', name: 'Point', selected: true },
                    { id: 'LINE_HOR', name: 'Horizontal Line', selected: false },
                    { id: 'LINE_VER', name: 'Vertical Line', selected: false },
                    { id: 'BOX', name: 'Box', selected: false }
                ],

                selectionOne: null
            }
        },

        components: {
            Row,
            Column,
            Btn
        },

        computed: {
            ...mapState('app', ['editableCanvas', 'canvasSelectionType']),
            ...mapGetters('app', ['selectedConfigurationTab'])
        },

        methods: {
            ...mapMutations('app', ['MAKE_CANVAS_EDITABLE']),

            enableOrDisableRanges() {
                const vm = this;
                const handlers = {
                    'POINT': () => {
                        vm.plotSelection.x.range = false;
                        vm.plotSelection.y.range = false;
                    },

                    'LINE_HOR': () => {
                        vm.plotSelection.x.range = true;
                        vm.plotSelection.y.range = false;
                    },

                    'LINE_VER': () => {
                        vm.plotSelection.x.range = false;
                        vm.plotSelection.y.range = true;
                    },

                    'BOX': () => {
                        vm.plotSelection.x.range = true;
                        vm.plotSelection.y.range = true;
                    },
                }

                handlers[vm.canvasSelectionType]();
            },

            setCanvasSelectionType() {
                this.canvasSelectionTypes.forEach(
                    selectionType => selectionType.selected = selectionType.id === this.canvasSelectionType);

                this.enableOrDisableRanges();
            },

            updateCanvasSelectionType(newValue) {
                this.$store.commit('app/UPDATE_CANVAS_SELECTION_TYPE', newValue);
                this.setCanvasSelectionType();
            },

            resetForm() {
                this.plotSelection.reset();
                this.$v.$reset();
                this.selectionOne = null;
                this.updateCanvasSelectionType('POINT');
            },

            saveConfig() {
                this.clearToasters();
                this.$v.$touch();
                if (this.validateForm()) {
                    this.$emit('save-config', this.plotSelection.clone());
                    this.resetForm();
                }
            },

            engagePreview(selection) {
                this.$log.debug(`previewing selection: ${JSON.stringify(selection)}`);
                this.$emit('preview-config', selection.clone());
            },

            applySelection({ coordinates }) {
                if (this.selectedConfigurationTab !== this.tabName) {
                    return;
                }

                let selectionTwo = null;
                let type = this.canvasSelectionType;

                if ('POINT' === this.canvasSelectionType
                    || this.selectionOne === null) {
                    this.selectionOne = {x: coordinates.x, y: coordinates.y};
                    type = 'POINT';
                } else {
                    selectionTwo = {x: coordinates.x, y: coordinates.y};
                }

                this.$log.debug(`type: ${type}`);
                this.$log.debug(`selectionOne: ${JSON.stringify(this.selectionOne)}`);
                this.$log.debug(`selectionTwo: ${JSON.stringify(selectionTwo)}`);

                const translatedSelection = _convertCoordinatesToPlotSelection(
                    type,
                    this.selectionOne,
                    selectionTwo
                );

                this.$log.debug(`translation: ${JSON.stringify(translatedSelection)}`);

                ['x', 'y'].forEach(axis => {
                    this.plotSelection[axis].from = translatedSelection[axis].from;
                    this.plotSelection[axis].to   = translatedSelection[axis].to;
                });

                this.engagePreview(PlotSelection.make(translatedSelection));
            }
        },

        created() {
            this.$bus.$on('app-start-modelling', this.resetForm);
            this.$bus.$on('canvas-click-event', this.applySelection);
        },

        mounted() {
            this.setCanvasSelectionType();
        }

    }

    export default NewCanvasSelection;

    //////////////////////////////////////////////////////////

    function _convertCoordinatesToPlotSelection(canvasSelectionType, selectionOne, selectionTwo) {
        const handlers = {
            POINT: () => ({
                x: {from: selectionOne.x, to: 0, range: false},
                y: {from: selectionOne.y, to: 0, range: false}
            }),

            LINE_HOR: () => ({
                x: {from: selectionOne.x, to: selectionTwo.x, range: true},
                y: {from: selectionOne.y, to: 0, range: false}
            }),

            LINE_VER: () => ({
                x: {from: selectionOne.x, to: 0, range: false},
                y: {from: selectionOne.y, to: selectionTwo.y, range: true}
            }),

            BOX: () => ({
                x: {from: selectionOne.x, to: selectionTwo.x, range: true},
                y: {from: selectionOne.y, to: selectionTwo.y, range: true}
            })
        };

        return handlers[canvasSelectionType]();
    }

</script>

<style scoped>
    .enable-check-box-label {
        margin-bottom: 0.5rem;
    }
</style>