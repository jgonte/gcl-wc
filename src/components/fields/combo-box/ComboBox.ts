import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import html  from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { Field } from "../Field";

export default class ComboBox extends Field {

    render(): NodePatchingData {

        return html`<gcl-drop-down>
            <span slot="header">
                <slot name="header"></slot>
            </span>
            <span slot="content">
                <slot name="content"></slot>
            </span>
        </gcl-drop-down>`;
    }
}

defineCustomElement('gcl-combo-box', ComboBox);