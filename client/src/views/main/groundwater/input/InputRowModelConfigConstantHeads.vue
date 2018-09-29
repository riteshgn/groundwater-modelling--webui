<template>
    <!-- Default horizontal form -->
    <form>
        <canvas-selections
            :groups="groupedSelections"
            @randomize="randomize"
            @remove-canvas-selection="removeConfig"></canvas-selections>

        <new-canvas-selection
            tab-name="heads"
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

    const ConfigConstantHeads = {

        components: {
            CanvasSelections,
            NewCanvasSelection
        },

        computed: {
            ...mapGetters('groundwater', ['stringifiedHeads']),

            groupedSelections() {
                return (
                    this.stringifiedHeads.reduce((out, item, index) => {
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
                removeConfig: 'groundwater/REMOVE_CONSTANT_HEAD_CONFIG',
                saveConfig: 'groundwater/ADD_CONSTANT_HEAD_CONFIG',
                previewConfig: 'groundwater/ADD_CONSTANT_HEAD_CONFIG_FOR_PREVIEW'
            }),

            randomize() {
                [
                    { x: {from: 0, to: 20, range: true}, y: {from: 5, range: false}, value: 20 },
                    { x: {from: 20, range: false}, y: {from: 6, to: 14, range: true}, value: 20 },
                    { x: {from: 21, to: 49, range: true}, y: {from: 14, range: false}, value: 20 },
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