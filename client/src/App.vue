<template>
    <div class="flexible-content">
        <app-header></app-header>
        <app-main></app-main>
        <app-footer></app-footer>
    </div>
</template>

<script>

    import AppHeader from './views/header/AppHeader.vue';
    import AppMain from './views/main/AppMain.vue';
    import AppFooter from './views/footer/AppFooter.vue';

    const App = {

        components: {
            AppHeader,
            AppMain,
            AppFooter
        }

    }

    export default App;

</script>