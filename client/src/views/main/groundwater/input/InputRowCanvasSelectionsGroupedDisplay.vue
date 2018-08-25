<template>
    <fieldset class="form-group mt-md-3">
        <legend><div class="legend-container">Current Canvas Selections</div></legend>

        <div class="canvas-selections">
            <span v-show="groups.length === 0">
                <small><em class="text-muted">No Selections Available</em></small>

                <btn
                    outline="primary"
                    size="sm"
                    class="waves-effect"
                    aria-label="Randomize"
                    aria-describedby="descriptionRandomize"
                    @click.native.prevent="$emit('randomize')">Add Random Points</btn>
                <div
                    id="descriptionRandomize"
                    class="sr-only">
                    Creates random canvas selections for the current tab.
                </div>
            </span>

            <row class="px-md-2">
                <grouped-display-item
                    v-for="group in groups"
                    :key="group.id"
                    :selections="group.selections"
                    @remove-canvas-selection="removeConfig"></grouped-display-item>
            </row>
        </div>
    </fieldset>
</template>

<script>

    import { Row, Btn } from 'mdbvue';

    import GroupedDisplayItem from './InputRowCanvasSelectionsGroupedDisplayItem.vue';

    const GroupedDisplay = {

        props: {
            groups: { type: Array, required: true }
        },

        components: {
            Row,
            Btn,
            GroupedDisplayItem
        },

        methods: {
            removeConfig(srNo) {
                this.$emit('remove-canvas-selection', srNo);
            }
        }

    }

    export default GroupedDisplay;

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
</style>