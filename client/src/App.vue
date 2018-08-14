<template>
    <div class="flexible-content">
        <app-header></app-header>
        <app-main></app-main>
        <app-footer></app-footer>

        <fab
            v-if="showModellingSystem"
            :main-icon="fab.mainIcon"
            :icon-size="fab.iconSize"
            :bg-color="fab.bgColor"
            :position="fab.position"
            :z-index="fab.zIndex"
            :actions="fabActions"
            :fixed-tooltip="fab.fixedTooltip"
            @restart="restart"
            @scroll-to-inputs="scrollToInputs"
            @scroll-to-output="scrollToOutput"
        ></fab>
    </div>
</template>

<script>

    import { mapState } from 'vuex';
    import fab from 'vue-fab';

    import AppHeader from './views/header/AppHeader.vue';
    import AppMain from './views/main/AppMain.vue';
    import AppFooter from './views/footer/AppFooter.vue';

    const App = {

        data() {
            return {
                fab: {
                    mainIcon: 'menu',
                    position: 'top-right',
                    iconSize: 'small',
                    bgColor: '#E65100',
                    zIndex: '100000',
                    fixedTooltip: false
                }
            }
        },

        components: {
            AppHeader,
            AppMain,
            AppFooter,
            fab
        },

        computed: {
            ...mapState('app', ['showModellingSystem']),
            ...mapState('groundwater', ['showOutput']),

            fabActions() {
                const actions = [
                    { name: 'restart', icon: 'cached', color: '#008a00',
                        tooltip: 'Clear changes and Restart' }
                ];

                if (this.showOutput) {
                    actions.push({ name: 'scroll-to-inputs', icon: 'arrow_upward', color: '#0072ee',
                        tooltip: 'Scroll to Model Configuration' });
                    actions.push({ name: 'scroll-to-output', icon: 'arrow_downward', color: '#0072ee',
                        tooltip: 'Scroll to Simulation Output' });
                }

                return actions;
            }
        },

        methods: {
            restart() {
                const message = [
                    "This action will reset all changes and clear the existing simulation result (if any)",
                    "Do you wish to continue?"
                ].join('\n');

                if (confirm(message)) {
                    this.$store.commit('groundwater/RESET_MODEL_CONFIG');
                    this.$bus.$emit('app-start-modelling', {sender: 'App.vue/restart'});
                }
            },

            scrollToInputs() {
                this.$bus.$emit('app-start-modelling', {sender: 'App.vue/scrollToInputs'});
            },

            scrollToOutput() {
                this.$bus.$emit('app-display-output', {sender: 'App.vue'});
            }
        }

    }

    export default App;

</script>