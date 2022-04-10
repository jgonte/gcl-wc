import { CustomElementComponentMetadata, CustomElementMetadata } from "../../interfaces";

export default function ComponentMetadataInitializerMixin(Base): any {

    return class ComponentMetadataInitializer extends Base {

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
}