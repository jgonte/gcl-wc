import { CustomElementMetadata, CustomElementPropertyMetadata } from "../interfaces";

/**
 * Initializes the properties of a custom element from the metadata configured
 * @param Base The base class to extend
 * @returns The mixin class
 */
const PropertyMetadataInitializerMixin = Base =>

    class PropertyMetadataInitializer extends Base {

        /**
         * The properties to track in the class
         */
        static properties: () => Record<string, CustomElementPropertyMetadata>;

        protected static initalizeProperties(metadata: CustomElementMetadata): void {

            const {
                properties
            } = this;

            if (properties === undefined) {

                return;
            }

            Object.entries(properties).forEach(([key, value]) => this._initializeProperty(key, value, metadata));

            // Merge the properties of the base class if any so we can validate and initialize
            // the values of the properties of the base class in the instance
            const baseClass = Object.getPrototypeOf(this.prototype)?.constructor;

            if (baseClass !== undefined) {

                const baseClassMetadata = baseClass.metadata;

                if (baseClassMetadata !== undefined) {

                    metadata.properties = new Map([...metadata.properties, ...baseClassMetadata.properties]);

                    metadata.propertiesByAttribute = new Map([...metadata.propertiesByAttribute, ...baseClassMetadata.propertiesByAttribute]);

                    metadata.observedAttributes = [...metadata.observedAttributes, ...baseClassMetadata.observedAttributes];
                }
            }
        }

        /**
         * Creates the setters and getters for the property
         * @param name 
         * @param propertyMetadata 
         * @returns The name of the observed attribute for that property
         */
        private static _initializeProperty(name: string, propertyMetadata: CustomElementPropertyMetadata, metadata: CustomElementMetadata): void {

            propertyMetadata.name = name; // Set the name of the property

            // Set the name of the attribute as same as the name of the property if no attribute name was provided
            if (propertyMetadata.attribute === undefined) {

                propertyMetadata.attribute = name;
            }

            Object.defineProperty(
                this.prototype,
                name,
                {
                    get(): any {

                        const value = this._properties[name];

                        return typeof value === 'function' ?
                            value() :
                            value;
                    },
                    set(this: any, value: unknown) {

                        this.setProperty(name, value);
                    },
                    configurable: true,
                    enumerable: true,
                }
            );

            // Add it to the metadata properties so the properties of the instances can be validated and initialized
            metadata.properties.set(name, propertyMetadata);

            const {
                attribute
            } = propertyMetadata;

            // Index the property descriptor by the attribute name
            metadata.propertiesByAttribute.set(attribute, propertyMetadata); // Index by attribute name

            // Add the observed attribute
            metadata.observedAttributes.push(propertyMetadata.attribute.toLowerCase());
        }

    }

export default PropertyMetadataInitializerMixin;
