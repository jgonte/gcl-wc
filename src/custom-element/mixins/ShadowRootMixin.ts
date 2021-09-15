/**
 * Mixin to manage whether the custom component has a shadow root or not
 * @param Base 
 * @returns 
 */
const ShadowRootMixin = Base =>

    class ShadowRoot extends Base {

        /** 
         * The DOM document in which this component is updated 
         */
        get document() {

            return this.shadowRoot !== null ?
                this.shadowRoot :
                this;
        }
    }

export default ShadowRootMixin;