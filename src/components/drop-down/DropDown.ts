import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";

export default class DropDown extends CustomElement  {

    render(): NodePatchingData {

        return html`<slot name="content"></slot>`;
    }
}

defineCustomElement('gcl-drop-down', DropDown);