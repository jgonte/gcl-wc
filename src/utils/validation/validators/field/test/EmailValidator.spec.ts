import EmailValidator from "../EmailValidator";
import { SingleValueFieldValidationContext } from "../SingleValueFieldValidator";

describe("EmailValidator tests", () => {

    it("EmailValidator with an undefined value should emit no errors", () => {

        const validator = new EmailValidator();

        let validationContext : SingleValueFieldValidationContext = {
            label: 'Customer Email',
            errors: [],
            warnings: [],
            value: undefined
        };

        let valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });

    it("EmailValidator with invalid value should emit a validation error message", () => {

        const validator = new EmailValidator();

        let validationContext : SingleValueFieldValidationContext = {
            label: 'Customer Email',
            errors: [],
            warnings: [],
            value: 'some.email'
        };

        let valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('Customer Email is invalid');
    });

    it("EmailValidator with a defined value should emit no errors", () => {

        const validator = new EmailValidator();

        let validationContext : SingleValueFieldValidationContext = {
            label: 'Customer Email',
            errors: [],
            warnings: [],
            value: 'sarah@example.com'
        };

        let valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });
});