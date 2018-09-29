<template>
    <column md="4">
        <row v-for="selection in selections" :key="selection.srNo">
            <column md="12" class="mb-md-1">
                <card class="mb-2">
                    <card-body>
                        <card-text>
                            <pre> {{ selection.x }} </pre>
                            <pre> {{ selection.y }} </pre>
                        </card-text>
                    </card-body>
                    <div class="container-footer">
                        <badge pill color="primary-color">{{ selection.value }}</badge>
                        <div class="container-close-btn text-right" title="Remove Selection">
                            <button
                                type="button"
                                class="close"
                                aria-label="Remove Selection"
                                @click="$emit('remove-canvas-selection', selection.srNo)">
                                <span aria-hidden="true"><i class="fa fa-trash"></i></span>
                            </button>
                        </div>
                    </div>
                </card>
            </column>
        </row>
    </column>
</template>

<script>

    import { Row, Column, Card, CardBody, CardTitle, CardText, Btn, Badge } from 'mdbvue';

    const GroupedDisplayItem = {

        props: {
            selections: { type: Array, required: true }
        },

        components: {
            Row,
            Column,
            Card,
            CardBody,
            CardTitle,
            CardText,
            Btn,
            Badge
        }

    };

    export default GroupedDisplayItem;

</script>

<style scoped>
    pre {
        margin-bottom: 0;
    }

    .card-body {
        padding-top: 1rem;
        padding-bottom: 0.5rem;
    }

    .container-footer {
        margin: 0 0.75rem 0.75rem 1.25rem;
        padding: 0;
    }

    .container-footer .badge {
        font-weight: 700;
        font-size: 0.75rem;
        padding: 0.5rem;
        background-color: #0073e9 !important;
    }

    .container-close-btn {
        display: inline;
    }

    .container-close-btn button.close {
        margin-top: 0.5rem;
        padding: 0;
        font-size: 0.9rem;
        color: #e72400;
        opacity: 0.85;
    }
</style>