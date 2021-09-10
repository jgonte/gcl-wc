import { CustomElementPropertyMetadata } from "../interfaces";

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
        static properties: Record<string, CustomElementPropertyMetadata>;

        /**
         * To index the property descriptor by attribute name
         */
        private static _propertiesByAttribute: Record<string, CustomElementPropertyMetadata> = {};

        protected static initalizeProperties(): void {

            const {
                properties
            } = this;

            if (properties === undefined) {

                return;
            }

            Object.entries(properties).forEach(([key, value]) => this._initializeProperty(key, value));
        }

        /**
         * Creates the setters and getters for the property
         * @param name 
         * @param propertyMetadata 
         * @returns The name of the observed attribute for that property
         */
        private static _initializeProperty(name: string, propertyMetadata: CustomElementPropertyMetadata): void {

            propertyMetadata.name = name; // Set the name of the property

            Object.defineProperty(
                this.prototype,
                name,
                {
                    get(): any {

                        return this._properties[name];
                    },
                    set(this: any, value: unknown) {

                        const {
                            attribute,
                            reflect
                        } = propertyMetadata;

                        const reflectOnAttribute = reflect === true ? attribute : undefined;

                        this.setProperty(name, value, reflectOnAttribute);
                    },
                    configurable: true,
                    enumerable: true,
                }
            );

            // Set the name of the attribute as same as the name of the property if no attribute name was provided
            if (propertyMetadata.attribute === undefined) {

                propertyMetadata.attribute = name;
            }

            const {
                attribute
            } = propertyMetadata;

            // Index the property descriptor by the attribute name
            this._propertiesByAttribute[attribute] = propertyMetadata; // Index by attribute name
        }

    }

export default PropertyMetadataInitializerMixin;
