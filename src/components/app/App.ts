import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { errorEvent } from "../../custom-element/mixins/components/ErrorableMixin";
import { html } from "../../renderer/renderer";

/**
 * The root class of the SPA
 * Centralizes: Authorization, Localization, Errors display
 */
export default class App extends CustomElement {

    static get state() {

        return {

            errors: {
                value: []
            }
        };
    }

    render() {

        return html`${this.renderErrors()}
            <slot></slot>`;
    }

    renderErrors() {

        const {
            errors
        } = this;

        if (errors.length === 0) {

            return null;
        }

        return html`<gcl-overlay>
                ${errors.map(e => html`<span>${e.message}</span>`)}
            </gcl-overlay>`;

        // return (
        //     <gcl-overlay>
        //         <gcl-alert
        //             type="error"
        //             message={this.getErrorMessage()}
        //             closable={true}
        //             style={{ maxWidth: '90%' }}
        //             close={() => {
        //                 this.setError(undefined);
        //             }}
        //         />
        //     </gcl-overlay>
        // );
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(errorEvent, this.handleError);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(errorEvent, this.handleError);
    }

    handleError(event: CustomEvent): void {

        const {
            error
        } = event.detail;

        this.errors = [...this.errors, error];

        event.stopPropagation();
    }
}

defineCustomElement('gcl-app', App);