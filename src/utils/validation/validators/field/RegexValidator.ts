import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface RegexValidatorOptions extends ValidatorOptions {

    regex: RegExp;
}

export default abstract class RegexValidator extends SingleValueFieldValidator {

    _regex: RegExp;

    constructor(options: RegexValidatorOptions) {

        super(options);

        this._regex = options.regex!;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        // Assume valid if the valid is undefined
        if (value === undefined)
        {
            return true;
        }

        var valid = this._regex.test(value);

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}