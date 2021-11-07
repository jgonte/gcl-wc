import { html } from "../../renderer/renderer";

/**
 * Mixin that handles errors
 * @param Base 
 */
const ErrorableMixin = Base =>

    class Errorable extends Base {

        static get state() {

            return {

                error: {
                    value: undefined
                }
            };
        }

        renderError() {

            const {
                error
            } = this;

            if (error === undefined) {

                return null;
            }

            return html`${this.getErrorMessage()}`;

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

        /**
         * Extracts the error message from the error object
         * @returns The error message from the server
         */
        getErrorMessage(): string {

            const {
                error
            } = this;

            if (error instanceof Error) {

                return error.message;
            }
            else { // Try to find the message of error returned by the server

                if (error.payload !== undefined) {

                    if (typeof error.payload === 'string') {

                        return error.payload;
                    }
                    else {

                        const payload = JSON.parse(error.payload);

                        if (payload.errors !== undefined) {

                            return Object.values(payload.errors).join('\n');
                        }
                        else if (payload.title !== undefined) {

                            return payload.title;
                        }
                    }
                }
                else {

                    return error.statusText;
                }
            }
        }

    };

export default ErrorableMixin;
