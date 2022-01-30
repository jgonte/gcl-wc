import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import { html } from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import styles from "./FormLabel.css";

export default class FormLabel extends CustomElement {

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
                value: 'space-evenly',
                options: ['start', 'center', 'space-around', 'space-between', 'space-evenly'],
                reflect: true,
                inherit: true
            }
        };
    }

    render(): NodePatchingData {

        return html`<gcl-row justify-content=${this.justifyContent || 'start'}>
            <slot></slot>
        </gcl-row>`;
    }
}

defineCustomElement('gcl-form-label', FormLabel);