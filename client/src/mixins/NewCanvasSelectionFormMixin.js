'use strict';

import { required, requiredIf, numeric, integer } from 'vuelidate/lib/validators';

import PlotSelection from '../core/PlotSelection';

export default {
    data() {
        return {
            plotSelection: new PlotSelection(),

            toasters: []
        }
    },

    validations: {
        plotSelection: {
            x: {
                from: { required, numeric },
                to: {
                    required: requiredIf(function (model) {
                        return this.plotSelection.x.range;
                    }),
                    numeric
                }
            },

            y: {
                from: { required, numeric },
                to: {
                    required: requiredIf(function (model) {
                        return this.plotSelection.x.range;
                    }),
                    numeric
                }
            },

            value: { required, integer }
        }
    },

    methods: {
        showErrorToaster(message) {
            const options = {
                type: 'error',
                icon: 'fa-exclamation-circle',
                position: 'bottom-right',
                action: [{
                    text: 'ok',
                    onClick : (e, toastObject) => {
                        toastObject.goAway(0);
                    }
                }]
            };

            this.toasters.push(
                this.$toasted.show(message, options)
            );
        },

        clearToasters() {
            for (let indx = 0; indx < this.toasters.length; indx++) {
                this.toasters[indx].goAway(0);
            }
            this.toasters.splice(0);
        },

        validateForm() {
            let valid = true;

            if (this.$v.plotSelection.x.from.$invalid) {
                this.showErrorToaster('From value for the x direction must be a valid positive integer');
                valid = false;
            }
            if (this.plotSelection.x.range && this.$v.plotSelection.x.to.$invalid) {
                this.showErrorToaster('To value for the x direction must be a valid positive integer');
                valid = false;
            }
            if (this.$v.plotSelection.y.from.$invalid) {
                this.showErrorToaster('From value for the y direction must be a valid positive integer');
                valid = false;
            }
            if (this.plotSelection.y.range && this.$v.plotSelection.y.to.$invalid) {
                this.showErrorToaster('To value for the y direction must be a valid positive integer');
                valid = false;
            }
            if (this.$v.plotSelection.value.$invalid) {
                this.showErrorToaster('Value must be a valid positive integer');
                valid = false;
            }

            return valid;
        },
    }
}