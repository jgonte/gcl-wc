import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { html } from "../../../renderer/renderer";
import styles from "./FormField.css";

export default class FormField extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    render() : NodePatchingData {

        return html`<slot name="label">Label</slot>
            <slot name="field"></slot>`;
    }
}

defineCustomElement('gcl-form-field', FormField);