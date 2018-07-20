<template>
    <!-- Default horizontal form -->
    <form>
        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-4">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="x-plotSelection-from">x</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        placeholder="from"
                        v-model.number="plotSelection.x.from">
                </div>
            </div>

            <div class="col-sm-4">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="x-plotSelection-to">to</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        placeholder="to"
                        :disabled="!plotSelection.x.range"
                        v-model.number="plotSelection.x.to">
                </div>
            </div>

            <div class="col-sm-1">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="xRange"
                    v-model="plotSelection.x.range">
            </div>
            <label class="col-sm-3 form-check-label" for="xRange">
                Range
            </label>
        </div>
        <!-- Grid row -->

        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-4">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="y-plotSelection-from">y</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        placeholder="from"
                        v-model.number="plotSelection.y.from">
                </div>
            </div>

            <div class="col-sm-4">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="y-plotSelection-to">to</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        placeholder="to"
                        :disabled="!plotSelection.y.range"
                        v-model.number="plotSelection.y.to">
                </div>
            </div>

            <div class="col-sm-1">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="yRange"
                    v-model="plotSelection.y.range">
            </div>
            <label class="col-sm-3 form-check-label" for="yRange">
                Range
            </label>
        </div>
        <!-- Grid row -->

        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-4">
                <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="plotSelection-value">Value</span>
                    </div>
                    <input
                        type="number"
                        class="form-control"
                        v-model.number="plotSelection.value">
                </div>
            </div>
        </div>
        <!-- Grid row -->

        <!-- Grid row -->
        <div class="form-group row">
            <div class="col-sm-10">
                <button
                    type="button"
                    class="btn btn-primary waves-effect btn-sm"
                    @click="saveConfig">Save</button>
                <button
                    type="button"
                    class="btn btn-outline-primary waves-effect btn-sm"
                    @click="randomize">Randomize</button>
            </div>
        </div>
        <!-- Grid row -->

        <hr/>

        <div class="table-wrapper-scroll-y">
            <!-- Table  -->
            <table class="table table-sm btn-table">
                <!-- Table head -->
                <thead class="blue lighten-4">
                    <tr>
                        <th>#</th>
                        <th>x coords</th>
                        <th>y coords</th>
                        <th>value</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <!-- Table head -->

                <!-- Table body -->
                <tbody>
                    <tr v-for="row in stringifiedHeads">
                        <th scope="row">{{ row.srNo }}</th>
                        <td><pre>{{ row.x }}</pre></td>
                        <td><pre>{{ row.y }}</pre></td>
                        <td><pre>{{ row.value }}</pre></td>
                        <td>
                            <button
                                type="button"
                                class="btn btn-primary waves-effect btn-sm m-0"
                                @click="removeConfig(row.srNo)"> x </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- Table  -->
        </div>
    </form>
    <!-- Default horizontal form -->
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import PlotSelection from '../../../../core/PlotSelection';

    const InputConfigHeads = {
        data() {
            return {
                plotSelection: new PlotSelection()
            };
        },

        computed: {
            ...mapGetters('groundwater', ['stringifiedHeads'])
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
        }
    }

    export default InputConfigHeads;
</script>

<style scoped>
    .form-group {
        margin-bottom: 0;
    }

    .form-group .form-check-label {
        padding-left: 0;
        padding-right: 0;
        margin-top: 0.30rem;
        margin-left: -1.25rem;
        font-size: 0.75rem;
    }

    .form-group .form-check-input {
        padding: 0;
        margin: 0.5rem 0 0 -1rem;
    }

    .table-wrapper-scroll-y {
        display: block;
        max-height: 160px;
        overflow-y: auto;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    tbody th {
        font-size: 0.75rem;
    }

    tbody td .btn {
        padding: .3rem .6rem;
        margin-top: -0.75rem !important;
    }
</style>