<template>
    <!-- Footer -->
    <ftr
        color="syracuse-extra-dark-gray"
        class="text-center font-small darken-2"
    >

        <p class="footer-copyright mb-0 py-3 text-center">
          &copy; {{ new Date().getFullYear() }} Copyright: Syracuse University
        </p>

    </ftr>
    <!-- Footer -->
</template>

<script>

    import { Footer } from 'mdbvue';

    const AppFooter = {

        components: {
            'ftr': Footer
        }

    }

    export default AppFooter;

</script>