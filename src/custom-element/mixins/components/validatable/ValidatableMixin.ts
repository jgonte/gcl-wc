import { ValidationContext } from "../../../../utils/validation/Interfaces";
import Validator from "../../../../utils/validation/validators/Validator";
import { CustomElementPropertyMetadata } from "../../../interfaces";

export const validationFailedEvent = 'validationFailedEvent';

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

        /**
         * Validates a validatable object
         * @returns true is the value is valid, false otherwise
         */
        validate(): boolean {

            if (this.validators.length === 0) {

                return true; // Nothing to validate
            }

            // Create a new validation context
            const context: ValidationContext = this.createValidationContext();

            // Validate
            this.validators.forEach((validator: Validator) => validator.validate(context));

            const {
                warnings,
                errors
            } = context;

            if (warnings.length > 0 || 
                errors.length > 0) {

                    this.dispatchCustomEvent(validationFailedEvent, {
                        warnings,
                        errors
                    });
            }

            return errors.length === 0;
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