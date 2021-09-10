import { CustomElementMetadata, CustomElementPropertyMetadata, CustomElementStateMetadata } from "../interfaces";

const htmlElementProperties: Set<string> = new Set<string>();

for (const key in HTMLElement.prototype) {
    //if (Object.prototype.hasOwnProperty.call(object, key)) {
    htmlElementProperties.add(key)

    //}
}

/**
 * 
 * @param Base Merges the metadata of the custom element
 * @returns 
 */
const MetadataMergerMixin = Base =>

    class MetadataMerger extends Base {

        static _metadata: CustomElementMetadata;

        protected static get metadata(): CustomElementMetadata {

            const properties = new Map<string, CustomElementPropertyMetadata>();

            const state = new Map<string, CustomElementStateMetadata>();

            const observedAttributes: string[] = [];

            let ctor = this as any;

            while (ctor !== HTMLElement) {

                if (ctor.properties !== undefined) {

                    Object.values(ctor.properties).forEach((p: CustomElementPropertyMetadata) => {

                        properties.set(p.name, p);

                        observedAttributes.push(p.attribute.toLowerCase());
                    });
                }

                if (ctor.state !== undefined) {

                    Object.values(ctor.state).forEach((s: CustomElementStateMetadata) => state.set(s.name, s));
                }

                ctor = Object.getPrototypeOf(ctor.prototype).constructor;
            }

            return {
                properties,
                state,
                observedAttributes,
                htmlElementProperties
            };
        }
    }

export default MetadataMergerMixin;
