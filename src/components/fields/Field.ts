import CustomElement from "../../custom-element/CustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import ValidatableMixin from "../../custom-element/mixins/components/validatable/ValidatableMixin";
import RequiredValidator from "../../utils/validation/validators/field/RequiredValidator";
import LocalizedText from "../localized-text/LocalizedText";
import styles from "./Field.css";

export const inputEvent = "inputEvent";

export const changeEvent = "changeEvent";

export const fieldAddedEvent = "fieldAddedEvent";

export default abstract class Field extends
    SizableMixin(
        ValidatableMixin(
            CustomElement
        )
    ) {

    // The temporary value being validated on input
    // Since it is not the final one there is no need to refresh
    private _tempValue: any = undefined;

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field
             */
            name: {
                type: String,
                required: true
            },

            /**
             * The initial value of the field
             */
            value: {
                type: [String, Object], // Ideally is a string but could be a more complex object
                mutable: true,
                reflect: true
            },

            disabled: {
                type: Boolean,
                mutable: true,
                reflect: true
            },

            required: {
                type: Boolean,
                inherit: true,
                mutable: true,
                reflect: true
            }
        };
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {

        if (attributeName === 'required') {

            if (newValue !== "false") { // Add a required validator

                if (!this.hasRequiredValidator()) {

                    const {
                        validators = []
                    } = this;

                    this.validators = [...validators, new RequiredValidator()];
                }
            }
            else { // remove any existing required validator

                if (this.hasRequiredValidator()) {

                    const {
                        validators
                    } = this;

                    const requiredValidator = validators.filter(v => v instanceof RequiredValidator)[0];

                    if (requiredValidator !== undefined) {

                        const index = validators.indexOf(requiredValidator);

                        validators.splice(index, 1);

                        this.validators = validators;
                    }
                }
            }
        }

        super.attributeChangedCallback(attributeName, oldValue, newValue);
    }

    hasRequiredValidator(): boolean {

        return this.validators.filter(v => v instanceof RequiredValidator).length > 1;
    }

    didAdoptChildCallback(parent, child) {

        super.didAdoptChildCallback?.(parent, child);

        this.dispatchCustomEvent(fieldAddedEvent, {
            field: child
        });
    }

    handleBlur(event) {

        //this.validate();
    }

    /**
     * Called every time the input changes
     * Perform validation to give instantaneous feedback but do not update the current value since it might keep changing
     * @param event 
     * @returns 
     */
    handleInput(event) {

        this._tempValue = this.getNewValue(event.target);

        this.validate(); // Validate the field on input

        this.dispatchCustomEvent(inputEvent, {
            modified: !this.dataField.hasSameInitialValue(this._tempValue)
        });
    }

    createValidationContext() /*: ValidationContext */ {

        const label = this.getLabel();

        const value = this._tempValue ?? this.value;

        return {
            label,
            value,
            warnings: [],
            errors: []
        };
    }

    initializeValidator(validator: string) {

        switch(validator) {

            case 'required': return new RequiredValidator();
            default: throw new Error(`initializeValidator is not implemented for validator: '${validator}'`);
        }
    }

    getLabel() : string {

        const {
            adoptingParent
        } = this;

        const lt = Array.from(adoptingParent.children).filter(c => c instanceof LocalizedText);

        if (lt.length > 0) {

            return (lt[0] as LocalizedText).innerHTML;
        }
        else {

            throw new Error('Not implemented');
        }
    }

    handleChange(event): void {

        // Reset the temporary value
        this._tempValue = undefined;

        // Retrieve the new value
        const target = event.target as HTMLInputElement;

        const oldValue = this.value;

        this.value = this.getNewValue(target);

        const {
            name,
            value
        } = this;

        this.dispatchCustomEvent(changeEvent, {
            name,
            oldValue,
            newValue: value
        });
    }

    getNewValue(input: HTMLInputElement): any {

        let value: any;

        switch (input.type) {
            case 'file':
                {
                    const {
                        files
                    } = input;

                    if (files.length === 0) { // No files selected

                        return value;
                    }

                    if (input.multiple === true) {

                        value = Array.from(files).map(f => {

                            return {
                                name: f.name,
                                type: f.type,
                                size: f.size,
                                content: URL.createObjectURL(f)
                            };
                        });
                    }
                    else {

                        const f = files[0];

                        value = {
                            name: f.name,
                            type: f.type,
                            size: f.size,
                            content: URL.createObjectURL(f)
                        };
                    }
                }
                break;
            default:
                {
                    value = input.value;
                }
                break;
        }

        return value;
    }
}