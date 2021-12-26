import { ValidatorConfig } from "./interfaces";
import RequiredValidator from "./validators/field/RequiredValidator";
import Validator from "./validators/Validator";

export default function createValidator(cfg: ValidatorConfig): Validator {

    const {
        type
    } = cfg;

    switch (type) {
        case 'required': return new RequiredValidator();
        default: throw Error(`Invalid validator type: ${type}`);
    }
}