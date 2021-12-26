import { ValidatorOptions } from "../Validator";
import RecordValidator, { RecordValidationContext } from "./RecordValidator";

export interface CustomRecordValidatorOptions extends ValidatorOptions {

    validateFcn: Function;
}

export default class CustomRecordValidator extends RecordValidator {

    validateFcn: Function;

    constructor(options: CustomRecordValidatorOptions) {

        super(options);

        this.validateFcn = options.validateFcn;
    }

    validate(context: RecordValidationContext): boolean {

        const data = this.getData(context);

        var valid = this.validateFcn.call(this, data);

        if (!valid) {

            this.emitErrors(context, { });
        }

        return valid;
    }
   
}