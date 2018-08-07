<template>
    <!--Main Navigation-->
    <header>
        <!-- Navbar -->
        <navbar
            class="flexible-navbar syracuse-orange white-text"
            position="top"
            name="SOGWaM - The Simple Online Groundwater Model"
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