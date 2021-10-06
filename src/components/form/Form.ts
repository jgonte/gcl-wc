import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import html from "../../virtual-dom/html";

export default class Form extends CustomElement {

    render() {

        return html`form`;
    }
}

defineCustomElement('gcl-form', Form);