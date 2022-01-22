import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";

export default class DataList extends CustomElement  {

    render(): NodePatchingData {

        return html`kuku`;
    }
}

defineCustomElement('gcl-data-list', DataList);