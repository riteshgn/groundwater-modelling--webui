<template>
    <div ref="plotly-container"><!-- Plotly chart will be drawn inside this DIV --></div>
</template>

<script>
    import debounce from 'lodash/debounce'

    const PlotlyGraph = {
        props: {
            traces: { type: Array, required: true },
            layout: { type: Object, required: true }
        },

        methods: {
            renderPlot() {
                Plotly.newPlot(
                    this.$refs['plotly-container'],
                    this.traces,
                    this.layout,
                    {displayModeBar: false}
                );
            },

            updateLayout() {
                Plotly.relayout(
                    this.$refs['plotly-container'],
                    this.layout
                );
            },

            initMethods() {
                this.__resizeListener = debounce(this.renderPlot, 200)
                window.addEventListener('resize', this.__resizeListener)
            }
        },

        watch: {
            traces: {
                deep: true,
                handler() {
                    this.renderPlot();
                }
            },

            layout: {
                deep: true,
                handler() {
                    this.updateLayout();
                }
            }
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.__resizeListener)
            this.__generalListeners.forEach(obj => this.$refs.container.removeAllListeners(obj.fullName))
            Plotly.purge(this.$refs['plotly-container'])
        },

        mounted() {
            this.renderPlot();
            this.initMethods();
        }
    };

    export default PlotlyGraph;
</script>