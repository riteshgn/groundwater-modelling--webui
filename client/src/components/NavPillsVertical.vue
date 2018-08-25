<template>
    <div class="row wow fadeIn">
        <div class="col-md-3">
            <div class="list-group list-group-flush">
                <a
                    :tabindex="0"
                    :class="{'list-group-item': true, 'active': tab.active, 'waves-effect': true}"
                    v-for="tab in tabs"
                    @click="switchTab(tab)"
                    @keyup.enter.space="switchTab(tab)">
                    <span v-html="tab.name"></span>
                </a>
            </div>
        </div>
        <div class="col-md-9">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    const NavPillsVertical = {
        data() {
            return { tabs: [] };
        },

        methods: {
            switchTab(thisTab) {
                this.tabs.forEach(tab => tab.active = false);
                thisTab.active = true;
            }
        },

        created() {
            this.tabs = this.$children;
        }
    }

    export default NavPillsVertical;
</script>

<style scoped>
    .config-option-box {
        left: -3.75rem;
        width: 11rem;
        -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        z-index: 1050;
        padding: 1.5rem;
    }

    .list-group .active {
        -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        -webkit-border-radius: 5px;
        border-radius: 5px;
    }

    .list-group-item {
        font-size: 0.65rem;
        color: #0072ee;
    }

    .list-group-item.active {
        color: #fff !important;
        background-color: #0072ee;
    }
</style>