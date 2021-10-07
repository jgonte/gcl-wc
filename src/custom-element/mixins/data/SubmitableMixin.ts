import Fetcher from "../../../utils/data/transfer/Fetcher";
import { ErrorResponse } from "../../../utils/data/transfer/interfaces";
import { Callback } from "../../interfaces";

const SubmitableMixin = Base =>

    class Submitable extends Base {

        static get properties() {

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

        static get state() {

            return {

                submitting: {
                    value: false
                }
            };
        }

        connectedCallback() {

            super.connectedCallback?.();

            this._fetcher = new Fetcher({
                onData: this.handleSubmitData,
                onError: this.handleSubmitError
            });
        }

        submit() {

            this.submitting = true;

            const {
                _fetcher,
                submitUrl
            } = this;

            const data = this.getSubmitData(); // Overriden by the derived classes

            _fetcher.fetch({
                url: submitUrl,
                method: this.getMethod(data),
                data
            });
        }

        getMethod(data: any) {

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

            //this.error = error;
        }
    }

export default SubmitableMixin;