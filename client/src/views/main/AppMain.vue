<template>
    <!--Main layout-->
    <main class="pt-5 mx-lg-5" id="main">
        <container fluid class="mt-5">
            <app-intro></app-intro>
            <gw-modelling v-if="showModellingSystem"></gw-modelling>
        </container>
    </main>
    <!--/.Main layout-->
</template>

<script>

    import { mapState } from 'vuex';
    import { Container } from 'mdbvue';

    import AppIntro from './introduction/AppIntro.vue';
    import GwModelling from './groundwater/GwModelling.vue';

    const Main = {
        components: {
            Container,
            AppIntro,
            GwModelling
        },

        computed: {
            ...mapState('app', ['showIntro', 'showModellingSystem'])
        }
    };

    export default Main;

</script>