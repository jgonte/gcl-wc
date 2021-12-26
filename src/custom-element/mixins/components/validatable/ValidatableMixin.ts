import { ValidationContext } from "../../../../utils/validation/Interfaces";
import Validator from "../../../../utils/validation/validators/Validator";
import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../../../interfaces";

const ValidatableMixin = Base =>

    class Validatable extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                validators: {
                    type: Array,
                    mutable: true,
                    value: [],
                    transform: function (value) {

                        return this.initializeValidators(value);
                    }
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                validationErrors: {
                    value: []
                },

                validationWarnings: {
                    value: []
                }
            };
        }

        /**
         * Validates a validatable object
         * @returns true is the value is valid, false otherwise
         */
        validate(): boolean {

            if (this.validators.length === 0) {

                return true; // Nothing to validate
            }

            // Reset warnings and errors
            this.validationWarnings = [];

            this.validationErrors = [];

            // Create a validation context
            const context: ValidationContext = this.createValidationContext();

            // Validate
            this.validators.forEach((validator: Validator) => validator.validate(context));

            // Show warnings and errors
            if (context.warnings.length > 0) {

                this.validationWarnings = context.warnings;
            }

            if (context.errors.length > 0) {

                this.validationErrors = context.errors;

                return false;
            }

            return true;
        }

        initializeValidators(validators: (Validator | string)[]): Validator[] {

            for (let i = 0; i < validators.length; ++i) {

                const validator = validators[i];

                if (typeof validator === 'string') {

                    validators[i] = this.initializeValidator(validator);
                }
            }

            return validators as Validator[];
        }
    };

export default ValidatableMixin;