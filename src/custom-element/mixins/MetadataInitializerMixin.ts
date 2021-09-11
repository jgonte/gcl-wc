import classMetadataRegistry from "../helpers/classMetadataRegistry";
import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../interfaces";
import AttributeChangeHandlerMixin from "./AttributeChangeHandlerMixin";
import StateChangeHandlerMixin from "./StateChangeHandlerMixin";

/**
 * Initializes a web component type (not instance) from the metadata provided
 * @param Base The base class to extend
 * @returns The mixin class
 */
const MetadataInitializerMixin = Base =>

    //@ts-ignore
    class MetadataInitializer extends
        StateChangeHandlerMixin( // This one extends from StateMetadataInitializer
            AttributeChangeHandlerMixin( // This one extends from PropertyMetadataInitializer
                Base
            )
        ) {


        // /** 
        //  * The style attached to the class
        //  */
        // static style: string;

        // // The style after merging the style of this one with the ones of the base classes
        // // it will be used to style the custom element
        // static mergedStyle: string;

        // static mergeStyles() {

        //     return '';
        // }

        static get observedAttributes(): string[] {

            // Initialize the metadata
            if (!classMetadataRegistry.has(this)) {

                classMetadataRegistry.set(this, {
                    properties: new Map<string, CustomElementPropertyMetadata>(),
                    observedAttributes: [],
                    state: new Map<string, CustomElementStateMetadata>()
                });
            }

            const metadata = classMetadataRegistry.get(this);

            (this as any).initalizeProperties(metadata);

            (this as any).initializeState(metadata);

            //this.mergedStyle = this.mergeStyles();

            return metadata.observedAttributes;
        }

    }

export default MetadataInitializerMixin;
