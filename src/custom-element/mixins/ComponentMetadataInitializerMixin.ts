import { CustomElementComponentMetadata, CustomElementMetadata } from "../interfaces";

const ComponentMetadataInitializerMixin = Base =>

    class ComponentMetadataInitializer extends Base {

        /**
         * The styles to track in the class
         */
        static component: () => CustomElementComponentMetadata;

        protected static initializeComponent(metadata: CustomElementMetadata): void {

            const {
                component
            } = this;

            if (component === undefined) {

                metadata.shadow = true; // It is true by default

                return;
            }

            metadata.shadow = (component as CustomElementComponentMetadata).shadow;       
        }
    }

export default ComponentMetadataInitializerMixin;