
import AttributeChangeHandlerMixin from "./AttributeChangeHandlerMixin";
import MetadataMergerMixin from "./MetadataMergerMixin";
import StateChangeHandlerMixin from "./StateChangeHandlerMixin";

/**
 * Initializes a web component type (not instance) from the metadata provided
 * @param Base The base class to extend
 * @returns The mixin class
 */
const MetadataInitializerMixin = Base =>

    //@ts-ignore
    class MetadataInitializer extends
        MetadataMergerMixin(
            StateChangeHandlerMixin( // This one extends from StateMetadataInitializer
                AttributeChangeHandlerMixin( // This one extends from PropertyMetadataInitializer
                    Base
                )
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

            (this as any).initalizeProperties();

            (this as any).initializeState();

            //this.mergedStyle = this.mergeStyles();

            return this.metadata.observedAttributes;
        }

    }

export default MetadataInitializerMixin;
