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
     * Fetches the mouse click coordindates using the available co-ordinate API
     */
    function _clickPoints(that, d3Event) {
        if (d3Event.layerX || d3Event.layerY) {
            // that.$log.debug(`Found layerX / layerY => ${d3Event.layerX}, ${d3Event.layerY}`);
            return {posX: d3Event.layerX, posY: d3Event.layerY};
        }

        if (d3Event.pageX || d3Event.pageY) {
            // that.$log.debug(`Found pageX / pageY => ${d3Event.pageX}, ${d3Event.pageY}`);
            return {posX: d3Event.pageX, posY: d3Event.pageY, addOffsets: true};
        }

        if (d3Event.clientX || d3Event.clientY)     {
            const posX = d3Event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            const posY = d3Event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            // that.$log.debug(`Found clientX / clientY => ${posX}, ${posY}`);
            return {posX, posY, addOffsets: true};
        }

        that.$log.error("Could not compute mouse click coordindates");
        return {posX: 0, posY: 0};
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

        const {posX, posY, addOffsets} = _clickPoints(that, d3Event);

        // bg is the 'rect' svg component which is the background of the grid
        const bg = plotlyContainer.getElementsByClassName('bg')[0];
        if (bg === undefined || bg === null) {
            that.$log.error("PlotlyGraph / _computeClickedCoordinates / Could not find background component");
            return errorOutput;
        }

        const xAxisRange = plotlyContainer.layout.xaxis.range;
        const yAxisRange = plotlyContainer.layout.yaxis.range;

        // offsets are selected based on trial and error
        // need to figure out if they work in a responsive environment
        const offsets = {
            x: addOffsets ? -83.5 : 0,
            y: addOffsets ? 110 : -0.5
        }

        // Get clicked x
        const x = Math.ceil(
            ((posX - bg.attributes['x'].value) / (bg.attributes['width'].value)) * (xAxisRange[1] - xAxisRange[0]) + xAxisRange[0] + offsets.x
        );
        // Get clicked y
        const y = Math.ceil(
            ((posY - bg.attributes['y'].value) / (bg.attributes['height'].value)) * (yAxisRange[0] - yAxisRange[1]) + yAxisRange[1] + offsets.y
        );

        // that.$log.debug(`Computed x: ${x}, y: ${y}`);

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