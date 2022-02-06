import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import html  from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import styles from "./FormLabel.css";

export default class FormLabel extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /** 
             * Whether the form field is required
             * If true it sets a field indicator as required and adds a required validator to the field
             */
            required: {
                type: Boolean,
                reflect: true,
                value: false
            },

            /** 
             * Whether the form field is modified to show it on the label
             */
            modified: {
                type: Boolean,
                reflect: true,
                value: false
            },

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
            },

            /**
             * The key to retrieve a localized help value from an i18n provider
             */
            helpResourceKey: {
                attribute: 'help-resource-key',
                type: String
            },

            /**
             * The help content
             */
            help: {
                type: String
            }
        };
    }

    render(): NodePatchingData {

        const {
            required,
            helpResourceKey,
            help,
            modified
        } = this;

        return html`<gcl-row justify-content=${this.justifyContent}>
            <slot name="label"></slot> 
            ${helpResourceKey !== undefined || help !== undefined ?
                html`<gcl-tool-tip>
                    <gcl-badge kind="primary" slot="trigger">
                        <span>?</span>
                    </gcl-badge>
                    <gcl-localized-text resource-key=${helpResourceKey} slot="content">${help || ''}</gcl-localized-text>
                </gcl-tool-tip>`
                : null}   
            ${required === true ?
                html`<gcl-tool-tip>
                    <gcl-badge kind="danger" slot="trigger">
                        <span>*</span>
                    </gcl-badge>
                    <gcl-localized-text resource-key="thisFieldIsRequired" slot="content">This field is required</gcl-localized-text>
                </gcl-tool-tip>`
                : null}     
            ${modified === true ?
                html`<gcl-tool-tip>
                    <gcl-badge kind="primary" slot="trigger">
                        <span>M</span>
                    </gcl-badge>
                    <gcl-localized-text resource-key="thisFieldHasBeenModified" slot="content">This field has been modified</gcl-localized-text>
                </gcl-tool-tip>`
                : null}
            <slot name="tools"></slot>   
        </gcl-row>`;
    }
}

defineCustomElement('gcl-form-label', FormLabel);