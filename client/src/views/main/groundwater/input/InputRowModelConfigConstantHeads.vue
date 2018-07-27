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
            </div>
        </div>
        <!-- Grid row -->

        <hr/>

        <div class="table-wrapper-scroll-y">
            <!-- Table  -->
            <tbl sm class="btn-table">
                <!-- Table head -->
                <tbl-head class="blue lighten-4">
                    <tr>
                        <th>#</th>
                        <th>x coords</th>
                        <th>y coords</th>
                        <th>value</th>
                        <th>Action</th>
                    </tr>
                </tbl-head>
                <!-- Table head -->

                <!-- Table body -->
                <tbl-body>
                    <tr v-for="row in stringifiedHeads">
                        <th scope="row">{{ row.srNo }}</th>
                        <td><pre>{{ row.x }}</pre></td>
                        <td><pre>{{ row.y }}</pre></td>
                        <td><pre>{{ row.value }}</pre></td>
                        <td>
                            <btn
                                color="primary"
                                size="sm"
                                class="m-0"
                                @click.native.prevent="removeConfig(row.srNo)"> x </btn>
                        </td>
                    </tr>
                </tbl-body>
            </tbl>
            <!-- Table  -->
        </div>
    </form>
    <!-- Default horizontal form -->
</template>

<script>

    import { mapGetters, mapMutations } from 'vuex';
    import { Tbl, TblHead, TblBody, Btn } from 'mdbvue';

    import PlotSelection from '../../../../core/PlotSelection';

    const ConfigConstantHeads = {

        data() {
            return {
                plotSelection: new PlotSelection()
            };
        },

        components: {
            Tbl,
            TblHead,
            TblBody,
            Btn
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
        },

        mounted() {
            if (!ENV_PRODUCTION)
                this.randomize();
        }

    }

    export default ConfigConstantHeads;

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