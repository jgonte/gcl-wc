import { CustomElementMetadata } from "../interfaces";

const StylesMetadataInitializerMixin = Base =>

    class StylesMetadataInitializer extends Base {

        /**
         * The styles to track in the class
         */
        static styles: () => string | string[];

        protected static initializeStyles(metadata: CustomElementMetadata): void {

            const {
                styles
            } = this;

            if (styles === undefined) {

                return;
            }

            metadata.styles = Array.isArray(styles) ?
                [...metadata.styles, ...styles] :
                [...metadata.styles, styles];

            // Do not inherit the styles of the base custom element by default             
        }
    }

export default StylesMetadataInitializerMixin;