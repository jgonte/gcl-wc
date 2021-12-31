import CustomElement from "../../custom-element/CustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import ValidatableMixin from "../../custom-element/mixins/components/validatable/ValidatableMixin";
import RequiredValidator from "../../utils/validation/validators/field/RequiredValidator";
import styles from "./Field.css";

export const changeEvent = "changeEvent";

export const fieldAddedEvent = "fieldAddedEvent";

export abstract class Field extends
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
                mutable: true,
                reflect: true
            }
        };
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

        // Retrieve the new value
        const target = event.target as HTMLInputElement;

        this._tempValue = this.getNewValue(target);

        return this.validate(); // Validate the field on input
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

        return "kuku";
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

        setTimeout(() => { // Repaint before dispatching the event

            this.dispatchCustomEvent(changeEvent, {
                name,
                oldValue,
                newValue: value
            });

        }, 0);
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