<template>
    <!--Main layout-->
    <main class="pt-5 mx-lg-5" id="main">
        <div class="container-fluid mt-5">
            <app-intro-row></app-intro-row>
            <gw-modelling-row v-if="showModellingSystem"></gw-modelling-row>
        </div>
    </main>
    <!--/.Main layout-->
</template>

<script>
    import { mapState } from 'vuex';

    import IntroRow from './IntroRow.vue';
    import GwmModellingRow from './groundwater/ModellingRow.vue';

    const Main = {
        components: {
            'app-intro-row': IntroRow,
            'gw-modelling-row': GwmModellingRow
        },

        computed: {
            ...mapState('app', ['showIntro', 'showModellingSystem'])
        }
    };

    export default Main;
</script>