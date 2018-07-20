<template>
    <!--Grid row-->
    <div class="row wow fadeIn">
        <!--Section-->
        <section class="my-5">
            <!-- Grid row -->
            <div class="row">

                <!-- Grid column -->
                <div class="col-lg-5">

                    <!-- Featured image -->
                    <div class="view overlay rounded z-depth-2 mb-lg-0 mb-4">
                        <img class="img-fluid" src="img/Groundwater-2.jpg" alt="GWM">
                    </div>

                </div>
                <!-- Grid column -->

                <!-- Grid column -->
                <div class="col-lg-5">

                    <!-- Post title -->
                    <h3 class="font-weight-bold mb-3"><strong>Welcome!</strong></h3>
                    <!-- Excerpt -->
                    <p class="text-justify">Darcy’s law is an equation that describes the flow of a fluid through a porous medium. The rate at which groundwater flows is equal to the product of the hydraulic conductivity multiplied by the hydraulic gradient.</p>
                    <p class="text-justify">This software modelling system will enable users to visualize the groundwater flow on a given terrain by simulating Darcy's law.</p>
                    <!-- Read more button -->
                    <a class="btn btn-success btn-md" @click="startModelling">Start Modelling</a>
                    <a class="btn btn-info btn-md">New User ?</a>

                </div>
                <!-- Grid column -->

            </div>
            <!-- Grid row -->

            <hr class="my-5">
        </section>
        <!--/.Section-->

    </div>
    <!--/.Grid row-->
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        methods: {
            ...mapMutations({
                startModelling: 'app/START_MODELLING'
            })
        }
    }
</script>