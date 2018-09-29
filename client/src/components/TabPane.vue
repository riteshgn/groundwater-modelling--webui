<template>
    <div class="tab-content" v-show="tabSelected">
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
            return {
                tabSelected: this.selected
            }
        },

        computed: {
            active: {
                get() {
                    return this.tabSelected;
                },

                set(newValue) {
                    this.tabSelected = newValue;
                    this.$emit('tab-selected', newValue);
                }
            }
        },

        watch: {
            selected: {
                handler: function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        this.tabSelected = newValue;
                    }
                }
            }
        }

    }

    export default TabPane;
</script>