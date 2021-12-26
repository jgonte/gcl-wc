import { html } from "../../../renderer/renderer";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import { ErrorResponse } from "../../../utils/data/transfer/interfaces";
import { Callback, CustomElementPropertyMetadata, CustomElementStateMetadata } from "../../interfaces";

const SubmitableMixin = Base =>

    class Submitable extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to post the data to
                 */
                submitUrl: {
                    attribute: 'submit-url',
                    type: String,
                    required: true
                },

                method: {
                    type: [String, Callback],
                    options: ['post', 'put']
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                submitting: {
                    value: false
                }
            };
        }

        renderSubmitting() {

            const {
                submitting
            } = this;

            if (submitting === false) {

                return null;
            }

            return html`<span key="submitting-overlay">Submiting ...</span>`;
        }

        connectedCallback() {

            super.connectedCallback?.();

            this._submitFetcher = new Fetcher({
                onData: data => this.handleSubmitData(data),
                onError: error => this.handleSubmitError(error)
            });
        }

        submit() {

            this.error = undefined; // Clear any previous error

            this.submitting = true;

            const data = this.getSubmitData(); // Overriden by the derived classes

            this._submitFetcher.fetch({
                url: this.submitUrl,
                method: this.getMethod(data),
                data
            });
        }

        getMethod(data: Record<string, any>) {

            const {
                method
            } = this;

            if (method !== undefined) {

                return typeof method === 'function' ?
                    method() :
                    method; // The user set an specific method
            }

            // Use conventions
            return data.id !== undefined ? 'put' : 'post';
        }

        handleSubmitData(data: Record<string, any>) {

            this.submitting = false;

            this.handleSubmitResponse(data);
        }

        handleSubmitError(error: ErrorResponse) {

            this.submitting = false;

            this.error = error;
        }
    }

export default SubmitableMixin;