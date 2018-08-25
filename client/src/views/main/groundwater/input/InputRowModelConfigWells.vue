<template>
    <!-- Default horizontal form -->
    <form>
        <canvas-selections
            :groups="groupedSelections"
            @randomize="randomize"
            @remove-canvas-selection="removeConfig"></canvas-selections>

        <new-canvas-selection
            tab-name="wells"
            @save-config="saveConfig"
            @preview-config="previewConfig"></new-canvas-selection>
    </form>
    <!-- Default horizontal form -->
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import PlotSelection from '../../../../core/PlotSelection';
    import CanvasSelections from './InputRowCanvasSelectionsGroupedDisplay.vue';
    import NewCanvasSelection from './InputRowNewCanvasSelection.vue';

    const InputConfigWells = {

        components: {
            CanvasSelections,
            NewCanvasSelection
        },

        computed: {
            ...mapGetters('groundwater', ['stringifiedWells']),

            groupedSelections() {
                return (
                    this.stringifiedWells.reduce((out, item, index) => {
                        const groupId = index % 3;
                        if ( out[groupId] === undefined ) {
                            out[groupId] = { id: groupId, selections: [] };
                        }
                        out[groupId].selections.push(item);
                        return out;
                    }, [])
                );
            }
        },

        methods: {
            ...mapMutations({
                removeConfig: 'groundwater/REMOVE_WELLS_CONFIG',
                saveConfig: 'groundwater/ADD_WELLS_CONFIG',
                previewConfig: 'groundwater/ADD_WELLS_CONFIG_FOR_PREVIEW'
            }),

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