<template>
    <!--Card-->
    <div :class="containerClazzes">

        <!-- Card header -->
        <div :class="headerClazzes" v-show="showHeader">
            <slot name="header"></slot>
        </div>

        <!--Card content-->
        <div :class="bodyClazzes">
            <slot name="body"></slot>
        </div>

        <!-- Card footer -->
        <div :class="footerClazzes" v-show="showFooter">
            <slot name="footer"></slot>
        </div>

    </div>
</template>

<script>
    const MdbCard = {
        props: {
            classes: {
                type: Array,
                default() { return [] }
            },

            headerClasses: {
                type: Array,
                default() { return [] }
            },

            bodyClasses: {
                type: Array,
                default() { return [] }
            },

            footerClasses: {
                type: Array,
                default() { return [] }
            },

            showHeader: { default: true },
            showFooter: { default: false },
        },

        computed: {
            containerClazzes() {
                return ['card'].concat(this.classes);
            },

            headerClazzes() {
                return ['card-header', 'text-center'].concat(this.headerClasses);
            },

            bodyClazzes() {
                return ['card-body'].concat(this.bodyClasses);
            },

            footerClazzes() {
                return ['card-body'].concat(this.footerClasses);
            }
        }
    }

    export default MdbCard;
</script>