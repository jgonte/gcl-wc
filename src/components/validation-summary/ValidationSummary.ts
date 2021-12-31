import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import { html } from "../../renderer/html";

export default class ValidationSummary extends CustomElement {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /** 
             * The warnings to display
             */
            warnings: {
                type: Array
            },

            /**
             * The errors to display
             */
            errors: {
                type: Array
            }
        };
    }

    render() {

        return html`${this.renderWarnings()}
            ${this.renderErrors()}`;
    }

    renderWarnings() {

        const {
            warnings
        } = this;

        if (warnings === undefined) {

            return null;
        }

        return warnings.map(warning => html`<gcl-alert kind="warning">${warning}</gcl-alert>`);
    }

    renderErrors() {

        const {
            errors
        } = this;

        if (errors === undefined) {

            return null;
        }

        return errors.map(error => html`<gcl-alert kind="error">${error}</gcl-alert>`);
    }
}

defineCustomElement('gcl-validation-summary', ValidationSummary);