import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface RangeValidatorOptions extends ValidatorOptions {

    minValue?: any;

    maxValue?: any;
}

export default class RangeValidator extends SingleValueFieldValidator {

    minValue: any;

    maxValue: any;

    constructor(options: RangeValidatorOptions = {}) {

        if (options.message === undefined) {

            options.message ='{{label}} is not in range from :{{minValue}} to {{maxValue}}';
        }

        super(options);

        this.minValue = options.minValue;

        this.maxValue = options.maxValue;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        const {
            minValue,
            maxValue
        } = this;

        var valid = value >= minValue && value <= maxValue;

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}