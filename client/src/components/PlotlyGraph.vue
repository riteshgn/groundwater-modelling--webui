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

            initialize() {
                // add a listener for window resize
                // debounce is used to avoid erratic resizes of the window
                // ref: https://lodash.com/docs/4.17.10#debounce
                this.__resizeListener = debounce(this.renderPlot, 200);
                window.addEventListener('resize', this.__resizeListener);

                // register event handlers
                _registerEvents(this);
            },

            cleanup() {
                window.removeEventListener('resize', this.__resizeListener);
                this.__generalListeners.forEach(obj => this.$refs.container.removeAllListeners(obj.fullName));
                Plotly.purge(this.$refs['plotly-container']);
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
            this.cleanup();
        },

        mounted() {
            this.initialize();
            this.renderPlot();
        }
    };

    export default PlotlyGraph;

    ////////////////////////////////////////////////////////

    /**
     * cleansing rule:
     * coordinate should not be less than lower bound of the range
     * and it should not be greater than upper bound of the range
     *
     * examples:
     *     clicked x-coordinate = 32; x-range-bounds = [0, 50]; result = 32
     *     clicked x-coordinate = 60; x-range-bounds = [0, 50]; result = 50
     *     clicked x-coordinate = -3; x-range-bounds = [0, 50]; result = 0
     */
    function _cleanse(coordinate, range) {
        return Math.max(Math.min(coordinate, range[1]), range[0]);
    }

    /**
     * The clicked coordinates need to be computed by doing some math on the
     * underlying layers created by d3.
     *
     * The output of this function is in the format
     *     { x: <int_point>, y: <int_point>, outOfRange: { x: <true/false>, y: <true/false } }
     *
     * Both coordinate points are ceiled and returned as integers.
     *
     * In the above output, 'outOfRange' indicates that the user has clicked outside
     * the grid on the graph. In such cases, the algorithm will bind that particular
     * x and/or y coordinate point to the nearest range bound (acheived using the
     * '_cleanse' function). If out of range, the corresponding coordinate's flag is
     * set to true.
     */
    function _computeClickedCoordinates(that, d3Event, plotlyContainer) {
        const errorOutput = { x: -1, y: -1 };

        if (d3Event === undefined || d3Event === null) {
            that.$log.error("PlotlyGraph / _computeClickedCoordinates / Could not find d3 event");
            return errorOutput;
        }

        // bg is the 'rect' svg component which is the background of the grid
        const bg = plotlyContainer.getElementsByClassName('bg')[0];
        if (bg === undefined || bg === null) {
            that.$log.error("PlotlyGraph / _computeClickedCoordinates / Could not find background component");
            return errorOutput;
        }

        const xAxisRange = plotlyContainer.layout.xaxis.range;
        const yAxisRange = plotlyContainer.layout.yaxis.range;

        // Get clicked x
        const x = Math.ceil(
            ((d3Event.layerX - bg.attributes['x'].value + 4) / (bg.attributes['width'].value)) * (xAxisRange[1] - xAxisRange[0]) + xAxisRange[0]
        );
        // Get clicked y
        const y = Math.ceil(
            ((d3Event.layerY - bg.attributes['y'].value + 4) / (bg.attributes['height'].value)) * (yAxisRange[0] - yAxisRange[1]) + yAxisRange[1]
        );

        // ensure range bounds
        const cleanX = _cleanse(x, xAxisRange);
        const cleanY = _cleanse(y, xAxisRange);

        return {
            x: cleanX,
            y: cleanY,
            outOfRange: { x: (x !== cleanX), y: (y !== cleanY) }
        };
    }

    /**
     * Registers event handlers for all required events on the Plotly Graph
     */
    function _registerEvents(that) {
        const plotlyContainer = that.$refs['plotly-container'];

        Plotly.d3.select(plotlyContainer)
            .on('click', (d, i) => that.$emit('p-d3-click', {
                d3Event: Plotly.d3.event,
                coordinates: _computeClickedCoordinates(that, Plotly.d3.event, plotlyContainer),
                nodeData: d,
                nodeIndex: i
            }));
    }
</script>