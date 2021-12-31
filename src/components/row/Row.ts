import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import { html } from "../../renderer/html";
import styles from "./Row.css";

export default class Row extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

        /**
         * Content justification
         */
            justifyContent: {
                attribute: 'justify-content',
                type: String,
                value: 'space-between',
                options: ['start', 'center', 'space-around', 'space-between', 'space-evenly'],
                reflect: true
            }
        };
    }

    render() {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-row', Row);