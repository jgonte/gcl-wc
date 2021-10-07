import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import html from "../../virtual-dom/html";

import { Callback } from "../../custom-element/interfaces";

export default class Button extends CustomElement {

    static get properties() {

        return {

            /**
             * Callback when the button is clicked
             */
            click: {
                type: Callback
            }
        };
    }

    render() {

        return html`<button
            onClick=${this.click}
        >
            <slot></slot>
        </button>`;
    }
}

defineCustomElement('gcl-button', Button);