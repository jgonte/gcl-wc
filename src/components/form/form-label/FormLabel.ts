import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import styles from "./FormLabel.css";

export default class FormLabel extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    render(): NodePatchingData {

        return html`<gcl-row justify-content="end">
            <slot></slot>
        </gcl-row>`;
    }
}

defineCustomElement('gcl-form-label', FormLabel);