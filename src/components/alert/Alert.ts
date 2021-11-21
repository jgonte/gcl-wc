import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";

export default class Alert extends CustomElement {

    render() {

        return html``;
    }
}

defineCustomElement('gcl-alert', Alert);