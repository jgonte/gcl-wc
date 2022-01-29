import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import SubmitableMixin from "../../custom-element/mixins/data/SubmitableMixin";
import ErrorableMixin from "../../custom-element/mixins/components/errorable/ErrorableMixin";
import LoadableMixin from "../../custom-element/mixins/data/LoadableMixin";
import { html } from "../../renderer/html";
import DataRecord from "../../utils/data/record/DataRecord";
import { changeEvent, Field, fieldAddedEvent } from "../fields/Field";
import { NodePatchingData } from "../../renderer/NodePatcher";
import ValidatableMixin from "../../custom-element/mixins/components/validatable/ValidatableMixin";
import { ValidationContext } from "../../utils/validation/Interfaces";
import styles from "./Form.css";

export default class Form extends
    SubmitableMixin(
        ValidatableMixin(
            LoadableMixin(
                ErrorableMixin(
                    CustomElement
                )
            )
        )
    ) {

    private _fields: Map<string, Field> = new Map<string, Field>();

    private _record: DataRecord = new DataRecord();

    constructor() {

        super();

        this.handleFieldAdded = this.handleFieldAdded.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    static get styles(): string {

        return styles as any;
    }

    render(): NodePatchingData {

        return html`<form>
            ${this.renderLoading()}
            ${this.renderSubmitting()}
            ${this.renderError()}
            <slot key="form-fields"></slot>
            ${this._renderButton()}
        </form>`;
    }

    private _renderButton(): NodePatchingData {

        // Doing onClick=${this.submit} binds the button instead of the form to the submit function
        return html`<gcl-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
           <gcl-localized-text resource-key="submit">Submit</gcl-localized-text>
           <gcl-icon name="box-arrow-right"></gcl-icon>
        </gcl-button>`;
    }

    getSubmitData() {

        const data = this._record.getData();

        console.log(JSON.stringify(data));

        return data;
    }

    submit() {

        if (this.validate()) {

            super.submit();
        }
    }

    createValidationContext(): ValidationContext {

        return {
            warnings: [],
            errors: []
        }
    }

    /**
     * Handles the data that was loaded from the server
     * @param data The data returned by the server
     */
    handleLoadedData(data: Record<string, any>) {

        console.log(JSON.stringify(data));

        const d = data.payload ?? data;

        this._record.initialize(d); // Fill the record without seting any modified fields

        this._populateFields(d); // Update the form with the returned values
    }

    /**
     * Called when a response from a submission is received from a server
     * @param data The data returned by the server
     */
    handleSubmitResponse(data: Record<string, any>) {

        console.log(JSON.stringify(data));

        const d = data.payload ?? data;

        this._record.setData(d); // Fill the record without seting any modified fields

        this._populateFields(d); // Update the form with the returned values
    }

    private _populateFields(data: any) {

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const field = this._fields.get(key);

                if (field !== undefined) {

                    field.value = data[key];
                }
                else { // The field does not need to exist for the given data member but let the programmer know it is missing

                    console.warn(`Field of name: '${key}' was not found for data member with same name`);
                }
            }
        }
    }

    initializeValidator(validator: string) {

        switch (validator) {

            default: throw new Error(`initializeValidator is not implemented for validator: '${validator}'`);
        }
    }

    validate(): boolean {

        let valid = super.validate();

        this._fields.forEach(field => {

            const v = field.validate();

            if (valid === true) {

                valid = v;
            }
        });

        return valid;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(fieldAddedEvent, this.handleFieldAdded);

        this.addEventListener(changeEvent, this.handleChange);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded);

        this.removeEventListener(changeEvent, this.handleChange);
    }

    handleFieldAdded(event: CustomEvent): void {

        const {
            field
        } = event.detail;

        const {
            name,
            type,
            value
        } = field;

        this._fields.set(name, field); // Add the field to the form

        const dataField = this._record.addField({ // Add the field to the record
            name,
            type,
            value
        });

        field.dataField = dataField; // Set the data field in the field so it "knows" if tis value changed from the initial one

        event.stopPropagation();
    }

    handleChange(event: CustomEvent): void {

        const {
            name,
            newValue
        } = event.detail;

        console.log('valueChanged: ' + JSON.stringify(event.detail));

        this._record.setData({
            [name]: newValue
        });

        event.stopPropagation();
    }
}

defineCustomElement('gcl-form', Form);