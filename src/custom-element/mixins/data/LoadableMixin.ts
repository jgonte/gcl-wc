import { html } from "../../../renderer/html";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import { ErrorResponse } from "../../../utils/data/transfer/interfaces";
import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../../interfaces";

const LoadableMixin = Base =>

    /**
     * Implements a mixin that loads a single record
     */
    class Loadable extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to retrieve the data from
                 */
                loadUrl: {
                    attribute: 'load-url',
                    type: String,
                    //required: true Loading the form or other component might be optional
                },

                /**
                 * Whether to load the data for the component when the component is connected
                 */
                autoLoad: {
                    attribute: 'auto-load',
                    type: Boolean,
                    value: true
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                loading: {
                    value: false
                }
            };
        }

        renderLoading() {

            if (this.loading === false) {

                return null;
            }

            return html`<span key="loading-overlay">Loading ...</span>`;
        }

        connectedCallback() {

            super.connectedCallback?.();

            if (this.loadUrl === undefined) {

                return;
            }

            this._loadFetcher = new Fetcher({
                onData: data => this.handleLoadData(data),
                onError: error => this.handleLoadError(error)
            });

            if (this.autoLoad === true) { // Wait until all the fields were added

                this.load();
            }
        }

        load() {

            this.error = undefined; // Clear any previous error

            this.loading = true;

            this._loadFetcher.fetch({
                url: this.loadUrl
            });
        }

        handleLoadData(data: Record<string, any>) {

            this.loading = false;

            this.handleLoadedData(data);
        }

        handleLoadError(error: ErrorResponse) {

            this.loading = false;

            this.error = error;
        }
    }

export default LoadableMixin;