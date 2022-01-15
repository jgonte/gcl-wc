import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";

export default class FormLabel extends CustomElement {

    render(): NodePatchingData {

        return html`<gcl-row justify-content="end">
            <slot></slot>
        </gcl-row>`;
    }
}

defineCustomElement('gcl-form-label', FormLabel);