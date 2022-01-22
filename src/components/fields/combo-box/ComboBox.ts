import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { Field } from "../Field";

export default class ComboBox extends Field  {

    render(): NodePatchingData {

        return html`kuku`;
    }
}

defineCustomElement('gcl-combo-box', ComboBox);