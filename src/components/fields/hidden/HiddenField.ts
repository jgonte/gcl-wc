import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { html } from "../../../renderer/renderer";
import { Field } from "../Field";

export default class HiddenField extends Field {

    render(): NodePatchingData {

        const {
            name,
            value,
        } = this;

        return html`<input
            type="hidden"
            name=${name}
            value=${value}
        />`;
    }
}

defineCustomElement('gcl-hidden-field', HiddenField);