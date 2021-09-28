import classMetadataRegistry from "../helpers/classMetadataRegistry";
import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../interfaces";
import AttributeChangeHandlerMixin from "./AttributeChangeHandlerMixin";
import ComponentMetadataInitializerMixin from "./ComponentMetadataInitializerMixin";
import StateChangeHandlerMixin from "./StateChangeHandlerMixin";
import StylesMetadataInitializerMixin from "./StylesMetadataInitializerMixin";

/**
 * Initializes a web component type (not instance) from the metadata provided
 * @param Base The base class to extend
 * @returns The mixin class
 */
const MetadataInitializerMixin = Base =>

    //@ts-ignore
    class MetadataInitializer extends
        StylesMetadataInitializerMixin(
            StateChangeHandlerMixin( // This one extends from StateMetadataInitializer
                AttributeChangeHandlerMixin( // This one extends from PropertyMetadataInitializer
                    ComponentMetadataInitializerMixin(
                        Base
                    )      
                )
            )
        ) {

        static get observedAttributes(): string[] {

            // Initialize the metadata
            if (!classMetadataRegistry.has(this)) {

                classMetadataRegistry.set(this, {
                    properties: new Map<string, CustomElementPropertyMetadata>(),
                    propertiesByAttribute: new Map<string, CustomElementPropertyMetadata>(),
                    observedAttributes: [],
                    state: new Map<string, CustomElementStateMetadata>(),
                    styles: [],
                    shadow: true
                });
            }

            const {
                metadata
            } = this;

            (this as any).initializeComponent(metadata);

            (this as any).initalizeProperties(metadata);

            (this as any).initializeState(metadata);

            (this as any).initializeStyles(metadata);

            return metadata.observedAttributes;
        }

        static get metadata() {

            return classMetadataRegistry.get(this);
        }

    }

export default MetadataInitializerMixin;
