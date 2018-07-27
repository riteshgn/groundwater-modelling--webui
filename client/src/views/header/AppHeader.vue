<template>
    <!--Main Navigation-->
    <header>
        <!-- Navbar -->
        <navbar
            class="flexible-navbar navbar-dark primary-color-dark"
            position="top"
            name="Groundwater Simulation"
            href="#"
            scrolling
        >

            <navbar-collapse></navbar-collapse>

        </navbar>
        <!-- /.Navbar -->
    </header>
    <!--/.Main Navigation-->
</template>

<script>

    import { Navbar, NavbarCollapse } from 'mdbvue';

    const AppHeader = {

        components: {
            Navbar,
            NavbarCollapse
        }

    };

    export default AppHeader;

</script>