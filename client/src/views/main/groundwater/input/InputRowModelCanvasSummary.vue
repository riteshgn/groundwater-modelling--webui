<template>
    <div class="d-md-flex align-content-md-between flex-md-wrap mx-md-3">
        <div class="px-md-2 flex-md-fill canvas-summary--content">
            Layout: <strong>{{ canvasSummary.layout }}</strong>
        </div>
        <div class="px-md-2 flex-md-fill canvas-summary--content">
            Height: <strong>{{ canvasSummary.height }}</strong>
        </div>
        <div class="px-md-2 flex-md-fill canvas-summary--content">
            Width: <strong>{{ canvasSummary.width }}</strong>
        </div>
        <div class="px-md-2 flex-md-fill canvas-summary--content">
            Thickness: <strong>{{ canvasSummary.thickness }}</strong>
        </div>
        <div class="px-md-2 flex-md-fill canvas-summary--content">
            Soil: <strong>{{ canvasSummary.soil }}</strong>
        </div>
        <div class="px-md-2 flex-md-fill canvas-summary--content">
            <abbr title="Recharge Rate">RR</abbr>: <strong>{{ canvasSummary.rechargeRate }}</strong>
        </div>
        <div
            class="px-md-2 flex-md-fill canvas-summary--content"
            v-if="showSelectionFlag">
            Selection: <strong :class="{'selection-off': !editableCanvas}">{{ selection }}</strong>
        </div>
    </div>
</template>

<script>

    import { mapState, mapGetters } from 'vuex';

    const CanvasSummary = {

        props: {
            showSelectionFlag: { type: Boolean, default: false }
        },

        computed: {
            ...mapState('app', ['editableCanvas']),
            ...mapGetters('groundwater', ['canvasSummary']),

            selection() {
                return this.editableCanvas ? 'ON' : 'OFF';
            }
        }

    }

    export default CanvasSummary;

</script>

<style scoped>
    .canvas-summary--content {
        font-size: 0.75rem;
        font-family: "Roboto", sans-serif !important;
    }

    .selection-off {
        color: #ADB3B8;
    }
</style>