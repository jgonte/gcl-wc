import CustomElement from "../../custom-element/CustomElement";
import oneOf from "../../custom-element/helpers/oneOf";
import styles from "./Field.css";

export abstract class Field extends CustomElement {

    static get styles() {

        return styles;
    }

    static get properties() {

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
                type: oneOf(String, Object), // Ideally is a string but could be a more complex object
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

    handleBlur(event) {

        //this.validate();
    }

    handleInput(event) {

        // Retrieve the new value
        const target = event.target as HTMLInputElement;

        const value = this.getNewValue(target);

        //this.setValue(value); // Do not update the current value, since it can keep changing

        const valid = this.validate(value); // Validate the field on input

        return valid;

        // if (!valid) {

        //     return;
        // }

        // const {
        //     input
        // } = this.props;

        // if (input !== undefined) {

        //     input(value);
        // }

    }

    handleChange(event) {

        // Retrieve the new value
        const target = event.target as HTMLInputElement;

        const oldValue = this.value;

        this.value = this.getNewValue(target);

        const {
            name,
            value
        } = this;

        this.dispatchCustomEvent('change', {
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

    /**
     * Validates a field against a given value
     * @param value The value to validate
     * @returns true is the value is valid, false otherwise
     */
    validate(value: string): boolean {

        return true;
    }
}