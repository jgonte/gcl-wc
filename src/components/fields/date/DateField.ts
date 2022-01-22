import { Field } from "../Field";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";

function formatDate(value: string) {

    const i = value.indexOf('T');

    return value.substring(0, i); // Extract the date part only
}

export default class DateField extends Field {

    render(): NodePatchingData {

        const {
            name,
            value,
            //required,
            disabled
        } = this;

        return html`<input
            type="date"
            name=${name}
            value=${value !== undefined ? formatDate(value) : undefined}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${event => this.handleBlur(event)}
            disabled=${disabled}
        />`;
    }
}

defineCustomElement('gcl-date-field', DateField);