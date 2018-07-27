<template>
    <!--Section-->
    <section id="app-intro" class="my-md-5 py-md-5">
        <!-- Grid row -->
        <row>

            <!-- Image column -->
            <column md="5" class="ml-auto">

                <!-- GW image -->
                <view-wrapper
                    class="overlay rounded z-depth-2 mb-lg-0 mb-4"
                    hover
                >
                    <img
                        class="img-fluid"
                        src="img/Groundwater-2.jpg"
                        alt="GWM" />

                </view-wrapper>
                <!-- GW image -->

            </column>
            <!-- Image column -->

            <!-- Intro Text column -->
            <column md="5" class="mr-auto">

                <h3 class="font-weight-bold mb-3 p-0">Welcome!</h3>

                <p class="text-justify">Darcy’s law is an equation that describes the flow of a fluid through a porous medium. The rate at which groundwater flows is equal to the product of the hydraulic conductivity multiplied by the hydraulic gradient.</p>

                <p class="text-justify">This software modelling system will enable users to visualize the groundwater flow on a given terrain by simulating Darcy's law.</p>

                <!-- Do more buttons -->
                <btn
                    color="success"
                    size="md"
                    class="waves-effect"
                    @click.native="startModelling">Start Modelling</btn>

                <btn
                    color="info"
                    size="md"
                    class="waves-effect">New User ?</btn>
                <!-- Do more buttons -->

            </column>
            <!-- Intro Text column -->

        </row>
        <!-- Grid row -->

        <hr class="my-5">
    </section>
    <!--/.Section-->
</template>

<script>

    import { mapMutations } from 'vuex';
    import { Row, Column, ViewWrapper, Btn } from 'mdbvue';

    const AppIntro = {

        components: {
            Row,
            Column,
            ViewWrapper,
            Btn
        },

        methods: {
            ...mapMutations({
                startModelling: 'app/START_MODELLING'
            })
        }

    }

    export default AppIntro;

</script>