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
                        <th>Action</th>
                    </tr>
                </thead>
                <!-- Table head -->

                <!-- Table body -->
                <tbody>
                    <tr v-for="row in stringifiedWells">
                        <th scope="row">{{ row.srNo }}</th>
                        <td><pre>{{ row.x }}</pre></td>
                        <td><pre>{{ row.y }}</pre></td>
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
            ...mapGetters('groundwater', ['stringifiedWells'])
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