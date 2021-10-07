import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import SubmitableMixin from "../../custom-element/mixins/data/SubmitableMixin";
import DataRecord from "../../utils/data/record/DataRecord";
import html from "../../virtual-dom/html";
import { change } from "../fields/Field";

export default class Form extends
    SubmitableMixin(
        CustomElement
    ) {

    private _record: DataRecord = new DataRecord();

    render() {

        return html`<form>
            <slot></slot>
            ${this.renderButton()}
        </form>`;
    }

    renderButton() {

        // Doing onClick=${this.submit} binds the button instead of the form to the submit function
        return html`<gcl-button onClick=${() => this.submit()}>
            Submit
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

    handleSubmitResponse(data: any) {

        console.log(JSON.stringify(data));

        this._record.setData(data);
    }

    validate(): boolean {

        return true;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(change, this.handleChange);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(change, this.handleChange);
    }

    handleChange(event: CustomEvent): void {

        const {
            name,
            value
        } = event.detail;

        console.log('valueChanged: ' + JSON.stringify(event.detail));

        this._record.setData({
            [name]: value
        })

        event.stopPropagation();
    }
}

defineCustomElement('gcl-form', Form);