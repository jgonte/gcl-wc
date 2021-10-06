import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import html from "../../../virtual-dom/html";

export default class FormField extends CustomElement {

    render() {

        return html`
            <slot name="label">Label</slot>
            <slot name="field"></slot>
        `;
    }
}

defineCustomElement('gcl-form-field', FormField);