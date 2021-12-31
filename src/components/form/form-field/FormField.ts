import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../../custom-element/helpers/mergeStyles";
import { CustomElementStateMetadata } from "../../../custom-element/interfaces";
import SizableMixin from "../../../custom-element/mixins/components/sizable/SizableMixin";
import { validationFailedEvent } from "../../../custom-element/mixins/components/validatable/ValidatableMixin";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { html } from "../../../renderer/html";
import styles from "./FormField.css";

export default class FormField extends
    SizableMixin(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            warnings: {
                value: []
            },

            errors: {
                value: []
            }
        };
    }

    render(): NodePatchingData {

        const {
            warnings,
            errors
        } = this;

        return html`<gcl-row justify-content="start">
            <slot name="label">Label</slot>
            <slot name="field"></slot>
        </gcl-row>
        <gcl-validation-summary
            warnings=${warnings} 
            errors=${errors}>
        </gcl-validation-summary>`;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(validationFailedEvent, this.handleValidationFailed);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(validationFailedEvent, this.handleValidationFailed);
    }

    handleValidationFailed(event: CustomEvent): void {

        const {
            warnings,
            errors
        } = event.detail;

        if (warnings.length > 0) {

            this.warnings = warnings;
        }

        if (errors.length > 0) {

            this.errors = errors;
        }

        event.stopPropagation();
    }
}

defineCustomElement('gcl-form-field', FormField);