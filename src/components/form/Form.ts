import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import SubmitableMixin from "../../custom-element/mixins/data/SubmitableMixin";
import ErrorableMixin from "../../custom-element/mixins/components/ErrorableMixin";
import { html } from "../../renderer/renderer";
import DataRecord from "../../utils/data/record/DataRecord";
import { changeEvent, fieldAddedEvent } from "../fields/Field";
import { NodePatchingData } from "../../renderer/NodePatcher";

export default class Form extends
    SubmitableMixin(
        ErrorableMixin(
            CustomElement
        )
    ) {

    private _fields: HTMLElement[] = [];

    private _record: DataRecord = new DataRecord();

    render() {

        return html`${this.renderSubmitting()}
            ${this.renderError()}
            <form key="form">
                <slot key="form-fields-slot"></slot>
                ${this._renderButton()}
            </form>`;
    }

    private _renderButton() : NodePatchingData {

        // Doing onClick=${this.submit} binds the button instead of the form to the submit function
        return html`<gcl-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
           <gcl-text intl-key="submit">Submit</gcl-text>
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

    handleSubmitResponse(data: Record<string, any>) {

        console.log(JSON.stringify(data));

        this._record.setData(data.payload ?? data);
    }

    validate(): boolean {

        return true;
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

    handleFieldAdded(event: CustomEvent): void  {

        const {
            field
        } = event.detail;

        this._fields.push[field];

        const {
            name,
            type,
            value
        } = field;

        if (value !== undefined) { // Set the initial value of the field

            this._record.addField({
                name,
                type,
                value
            });
        }

        event.stopPropagation();
    }

    handleChange(event: CustomEvent): void {

        const {
            name,
            value
        } = event.detail;

        console.log('valueChanged: ' + JSON.stringify(event.detail));

        this._record.setData({
            [name]: value
        });

        event.stopPropagation();
    }
}

defineCustomElement('gcl-form', Form);