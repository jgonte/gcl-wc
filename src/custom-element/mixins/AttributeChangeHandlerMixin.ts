import valueConverter from "../helpers/valueConverter";
import { CustomElementPropertyMetadata } from "../interfaces";
import PropertyMetadataInitializerMixin from "./PropertyMetadataInitializerMixin";

const AttributeChangeHandlerMixin = Base =>

    class AttributeChangeHandler extends PropertyMetadataInitializerMixin(Base) { // This mixin requires an implementation of setProperty

        /**
         * The properties of the instance
         */
        private _properties: Record<string, any> = {};

        /**
         * Map of the metadata of the changed properties so that the "change" method can be called after the update of the DOM
         */
        private _changedProperties: Map<string, CustomElementPropertyMetadata> = new Map<string, CustomElementPropertyMetadata>();

        constructor() {

            super();

            this._initializePropertiesWithDefaultValues((this.constructor as any).metadata.properties);
        }

        /**
         * Initializes the properties that have a default value
         * @param propertiesMetadata 
         */
        private _initializePropertiesWithDefaultValues(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    value
                } = property;

                if (this._properties[name] === undefined &&
                    value !== undefined) {

                    this.setProperty(name, value);
                }
            }
        }

        connectedCallback() {

            super.connectedCallback?.();

            const {
                properties
            } = (this.constructor as any).metadata;

            this._validateRequiredProperties(properties);
        }

        // Without defining this method, the observedAttributes getter will not be called
        // Also no need to check that the property was configured because if it is not configured, 
        // it will not generate the observedAttribute and therefore this method won't be called for that attribute
        /**
         * Called when there is a change in an attribute
         * @param attributeName
         * @param oldValue 
         * @param newValue 
         */
        attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null) {

            super.attributeChangedCallback?.(attributeName, oldValue, newValue);

            this._setAttribute(attributeName, newValue);
        }

        /**
         * Validates that all the required properties have been set
         * @param propertiesMetadata 
         */
        private _validateRequiredProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            const missingValueAttributes: string[] = [];

            for (const [, property] of propertiesMetadata) {

                const {
                    required,
                    attribute
                } = property;

                if (required === true &&
                    this.attributes[attribute] === undefined) { // The attribute for that property has not been set

                    missingValueAttributes.push(attribute);
                }
            }

            if (missingValueAttributes.length > 0) {

                throw Error(`The attributes: [${missingValueAttributes.join(', ')}] must have a value`)
            }
        }

        // /**
        //  * Overrides the parent method to verify that it is accessing a configured property
        //  * @param attribute 
        //  * @param value 
        //  */
        // setAttribute(attribute: string, value: any) {

        //     // Verify that the property is one of the configured in the custom element
        //     if ((this.constructor as any)._propertiesByAttribute[attribute] === undefined &&
        //         !(this.constructor as any).metadata.htmlElementProperties.has(attribute)) {

        //         throw Error(`There is no configured property for attribute: '${attribute}' in type: '${this.constructor.name}'`)
        //     }

        //     super.setAttribute(attribute, value);
        // }

        private _setAttribute(attribute: string, value: any): boolean {

            // Verify that the property is one of the configured in the custom element
            let propertyMetadata = (this.constructor as any).metadata.propertiesByAttribute.get(attribute);

            const {
                name,
                type
            } = propertyMetadata;

            value = valueConverter.toProperty(value, type); // Covert from the value returned by the parameter

            return this.setProperty(name, value);
        }

        protected setProperty(name: string, value: any): boolean {

            const oldValue = this._properties[name];

            if (oldValue === value) {

                return false;
            }

            if (typeof value === 'function') {

                this._properties[name] = (value as Function).bind(this);
            }
            else {

                this._properties[name] = value;
            }

            // Verify that the property is one of the configured in the custom element
            let propertyMetadata: CustomElementPropertyMetadata = (this.constructor as any).metadata.properties.get(name);

            const {
                attribute,
                reflect,
                //change We call change after the element was updated in the DOM
            } = propertyMetadata;

            const reflectOnAttribute = reflect === true ? attribute : undefined;

            if (reflectOnAttribute !== undefined) { // Synchronize with the attribute of the element

                value = valueConverter.toAttribute(value);

                if (value === '') {

                    this.removeAttribute(reflectOnAttribute);
                }
                else {

                    // This will trigger the attributeChangedCallback
                    this.setAttribute(reflectOnAttribute, value);
                }

            }

            this._changedProperties.set(name, (this.constructor as any).metadata.properties.get(name));

            return true;
        }

        protected callAttributesChange() {

            this._changedProperties.forEach((p, k) => {

                if (p.afterUpdate !== undefined) { // Call the change function if defined

                    p.afterUpdate.call(this);
                }
            });
        }

        protected clearChangedProperties() {

            this._changedProperties.clear();
        }

    }

export default AttributeChangeHandlerMixin;
