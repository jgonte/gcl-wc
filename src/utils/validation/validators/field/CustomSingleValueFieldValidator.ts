import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface CustomFieldValidatorOptions extends ValidatorOptions {

    validateFcn: Function;
}

export default class CustomSingleValueFieldValidator extends SingleValueFieldValidator {

    validateFcn: Function;

    constructor(options: CustomFieldValidatorOptions) {

        super(options);

        this.validateFcn = options.validateFcn;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        var valid = this.validateFcn.call(this, value);

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}