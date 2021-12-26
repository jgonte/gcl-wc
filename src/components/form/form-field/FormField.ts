import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../../custom-element/helpers/mergeStyles";
import SizableMixin from "../../../custom-element/mixins/components/sizable/SizableMixin";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { html } from "../../../renderer/renderer";
import styles from "./FormField.css";

export default class FormField extends
    SizableMixin(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    render(): NodePatchingData {

        return html`<slot name="label">Label</slot>
            <slot name="field"></slot>`;
    }
}

defineCustomElement('gcl-form-field', FormField);