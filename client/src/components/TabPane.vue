<template>
    <div class="tab-content" v-show="active">
        <div class="tab-pane fade show active" role="tabpanel">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    const TabPane = {
        props: {
            name: { type: String, required: true },
            selected: { type: Boolean, default: false }
        },

        data() {
            return { active: false };
        },

        mounted() {
            this.active = this.selected;
        }
    }

    export default TabPane;
</script>