import classMetadataRegistry from "../helpers/classMetadataRegistry";
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
         * Validates that all the required properties have been set
         * @param propertiesMetadata 
         */
        private _validateRequiredProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            const missingValueAttributes: string[] = [];

            for (const [name, property] of propertiesMetadata) {

                if (property.required === true &&
                    this._properties[name] === undefined) { // No value set

                    missingValueAttributes.push(property.attribute);
                }
            }

            if (missingValueAttributes.length > 0) {

                throw Error(`The attributes: [${missingValueAttributes.join(', ')}] must have a value`)
            }
        }

        /**
         * Initializes the properties that have a default value
         * @param propertiesMetadata 
         */
        private _initializePropertiesWithDefaultValues(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    attribute,
                    value,
                    reflect
                } = property;

                if (this._properties[name] === undefined &&
                    value !== undefined) {

                    const reflectOnAttribute = reflect === true ? attribute : undefined;

                    this.setProperty(name, value, reflectOnAttribute);
                }
            }
        }

        connectedCallback() {

            super.connectedCallback?.();

            const {
                properties
            } = classMetadataRegistry.get(this.constructor);

            this._validateRequiredProperties(properties);

            this._initializePropertiesWithDefaultValues(properties);
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
        attributeChangedCallback(attributeName: string, oldValue, newValue) {

            super.attributeChangedCallback?.(attributeName, oldValue, newValue);

            this._setAttribute(attributeName, newValue);
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
            let propertyMetadata = (this.constructor as any)._propertiesByAttribute[attribute];
            const {
                name,
                type,
                reflect
            } = propertyMetadata;

            value = valueConverter.toProperty(value, type); // Covert from the value returned by the parameter

            const reflectOnAttribute = reflect === true ? attribute : undefined;

            return this.setProperty(name, value, reflectOnAttribute);
        }

        setProperty(name: string, value: any, reflectOnAttribute: string): boolean {

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

            if (reflectOnAttribute !== undefined) { // Synchronize with the attribute of the element

                value = valueConverter.toAttribute(value);

                // This will trigger the attributeChangedCallback
                this.setAttribute(reflectOnAttribute, value);
            }

            return true;
        }

    }

export default AttributeChangeHandlerMixin;
