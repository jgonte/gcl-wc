import { Constructor } from "../../interfaces";

export default function defineCustomElement(name: string, constructor: CustomElementConstructor | Constructor) {

    if (customElements.get(name) === undefined) {

        customElements.define(name, constructor);
    }
}