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
                        :src="GroundwaterImage"
                        alt="General representation of Groundwater" />

                </view-wrapper>
                <!-- GW image -->

            </column>
            <!-- Image column -->

            <!-- Intro Text column -->
            <column md="5" class="mr-auto">

                <p class="h4 font-weight-bold mb-3 p-0">Welcome</p>

                <p class="text-justify">Numerical groundwater models have become one of the most commonly used and important groundwater tools over the last half century. This has given experienced groundwater modelers increased control and power to answer a wide range of questions. However, complex models and interfaces are difficult for novices to learn.</p>

                <p class="text-justify">The Simple Online Groundwater Model (SOGWaM) is built for budding hydro geology enthusiasts. It allows you to simulate and visualize groundwater flow, and to understand how system changes affect the flow field by developing and testing hypotheses.</p>

                <p class="text-justify">Happy Learning !</p>

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
    </section>
    <!--/.Section-->
</template>

<script>

    import { Row, Column, ViewWrapper, Btn } from 'mdbvue';

    import GroundwaterImage from './introduction.jpg';

    const AppIntro = {

        data() {
            return {
                GroundwaterImage
            }
        },

        components: {
            Row,
            Column,
            ViewWrapper,
            Btn
        },

        methods: {
            startModelling() {
                this.$store.commit('app/START_MODELLING');
                this.$bus.$emit('app-start-modelling', {sender: 'AppIntro.vue'});
            }
        }

    }

    export default AppIntro;

</script>