import template from "../../../utils/template";
import { ValidationContext } from "../interfaces";

export interface ValidatorOptions {

    message?: string;
}

export default abstract class Validator {

    /** The message to add to the validation context */
    message?: string;

    constructor(options: ValidatorOptions) {

        this.message = options?.message;
    }

    abstract validate(context: ValidationContext): boolean;

    /**
     * Adds an error message to the arrays of errors of the context
     * @param context The context containing the array of errors
     * @param data The data to replace the template placeholders with
     */
    emitErrors(context: ValidationContext, data: any) {

        const result = template(this.message!, data);

        context.errors.push(result.text!);
    }

    /**
     * Adds an warning message to the arrays of warnings of the context
     * @param context The context containing the array of warnings
     * @param data The data to replace the template placeholders with
     */
    emitWarnings(context: ValidationContext, data: any) {

        const result = template(this.message!, data);

        context.warnings.push(result.text!);
    }
}