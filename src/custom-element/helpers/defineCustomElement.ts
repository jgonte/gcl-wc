import { Constructor } from "../../interfaces";

export default function defineCustomElement(name: string, constructor: CustomElementConstructor | Constructor) {

    if (customElements.get(name) === undefined || // Chrome
        customElements.get(name) === null) { // Happy DOM

        customElements.define(name, constructor);
    }
}