import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../../custom-element/helpers/mergeStyles";
import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../../../custom-element/interfaces";
import SizableMixin from "../../../custom-element/mixins/components/sizable/SizableMixin";
import { validationEvent } from "../../../custom-element/mixins/components/validatable/ValidatableMixin";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import { html } from "../../../renderer/html";
import styles from "./FormField.css";
import { inputEvent } from "../../fields/Field";

export default class FormField extends
    SizableMixin(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /** 
             * Whether the form field is required
             * If true it sets a field indicator as required and adds a required validator to the field
             */
            required: {
                type: Boolean,
                mutable: true,
                reflect: true,
                value: false
            },

            /**
             * The width of the labels of the form
             */
            labelWidth: {
                attribute: 'label-width',
                type: String,
                reflect: true,
                inherit: true
            },

            /**
             * Content justification
             */
            justifyLabelContent: {
                attribute: 'justify-label-content',
                type: String,
                value: 'space-evenly',
                options: ['start', 'center', 'space-around', 'space-between', 'space-evenly'],
                reflect: true,
                inherit: true
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            /**
             * Whether the field has been modified (Its value differs from the initial/loaded one)
             */
            modified: {
                value: false
            },

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
            labelWidth,
            justifyLabelContent,
            required,
            modified,
            warnings,
            errors
        } = this;

        const formLabelWidth = `width: ${labelWidth};`;

        return html`<gcl-row id="field-row" justify-content="start">    
            <gcl-form-label justify-content=${justifyLabelContent} style=${formLabelWidth}>
                <slot name="label">Label</slot>
                ${required === true ?
                html`<gcl-tool-tip>
                        <gcl-badge kind="danger" slot="trigger">
                            <span>*</span>
                        </gcl-badge>
                        <gcl-localized-text resource-key="thisFieldIsRequired" slot="content">This field is required</gcl-localized-text>
                    </gcl-tool-tip>`
                : null}     
                <span>
                    ${modified === true ?
                html`<gcl-tool-tip>
                        <gcl-badge kind="primary" slot="trigger">
                            <span>M</span>
                        </gcl-badge>
                        <gcl-localized-text resource-key="thisFieldHasBeenModified" slot="content">This field has been modified</gcl-localized-text>
                    </gcl-tool-tip>`
                : null}
                </span>    
                <slot name="tools"></slot>
            </gcl-form-label>           
            <span>:</span>
            <slot name="field"></slot>      
        </gcl-row>
        <gcl-validation-summary
            warnings=${warnings} 
            errors=${errors}>
        </gcl-validation-summary>`;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(inputEvent, this.handleInput);

        this.addEventListener(validationEvent, this.handleValidation);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(inputEvent, this.handleInput);

        this.removeEventListener(validationEvent, this.handleValidation);
    }

    handleInput(event: CustomEvent): void {

        const {
            modified
        } = event.detail;

        this.modified = modified;

        event.stopPropagation();
    }

    handleValidation(event: CustomEvent): void {

        const {
            warnings,
            errors
        } = event.detail;

        this.warnings = warnings;

        this.errors = errors;

        event.stopPropagation();
    }
}

defineCustomElement('gcl-form-field', FormField);