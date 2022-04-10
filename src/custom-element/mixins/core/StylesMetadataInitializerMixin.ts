import { CustomElementMetadata } from "../../interfaces";

export default function StylesMetadataInitializerMixin(Base): any {

    return class StylesMetadataInitializer extends Base {

        /**
         * The styles to track in the class
         */
        static styles: () => string;

        protected static initializeStyles(metadata: CustomElementMetadata): void {

            const {
                styles
            } = this;

            if (styles === undefined) {

                return;
            }

            // metadata.styles = Array.isArray(styles) ?
            //     [...metadata.styles, ...styles] :
            //     [...metadata.styles, styles];

            metadata.styles = styles as any;

            // Do not inherit the styles of the base custom element by default             
        }
    }
}