import { attributeMarkerPrefix } from "../../../renderer/createTemplate";
import findPropertyValueUp from "../../helpers/findParentProperty";
import valueConverter from "../../helpers/valueConverter";
import { CustomElementPropertyMetadata } from "../../interfaces";
import PropertyMetadataInitializerMixin from "./PropertyMetadataInitializerMixin";

export default function AttributeChangeHandlerMixin(Base) : any {

    return class AttributeChangeHandler extends PropertyMetadataInitializerMixin(Base) { // This mixin requires an implementation of setProperty

        /**
         * The properties of the instance
         */
        private _properties: Record<string, any> = {};

        /**
         * Map of the metadata of the changed properties so that the "change" method can be called after the update of the DOM
         */
        private _changedProperties: Map<string, CustomElementPropertyMetadata> = new Map<string, CustomElementPropertyMetadata>();

        /**
         * The properties that by the time the component gets connected, do not have any attribute explicitly set in the markup
         */
        private _initiallyUndefinedProperties: Set<string> = new Set<string>();

        connectedCallback() {

            super.connectedCallback?.();

            const {
                properties
            } = (this.constructor as any).metadata;

            this._initializeDefaultProperties(properties);

            this._validateRequiredProperties(properties);
        }

        /**
         * Initializes the properties that have a default value
         * @param propertiesMetadata 
         */
        private _initializeDefaultProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    value
                } = property;

                if (this._properties[name] === undefined) { // Not explicitly set

                    this._initiallyUndefinedProperties.add(name);

                    if (value !== undefined) { // Set the default value

                        this.setProperty(name, value);
                    }
                }
            }
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
                    (this.attributes[attribute] === undefined &&
                        this[attribute] === undefined)) { // The attribute for that property has not been set

                    missingValueAttributes.push(attribute);
                }
            }

            if (missingValueAttributes.length > 0) {

                throw Error(`The attributes: [${missingValueAttributes.join(', ')}] must have a value`)
            }
        }

        /**
         * Called when the component added a child or it was added as a child
         * @param parent 
         * @param child 
         */
        didAdoptChildCallback(parent: HTMLElement, child: HTMLElement) {

            const {
                metadata
            } = child.constructor as any;

            if (metadata === undefined) { // Probably not a custom component

                return;
            }

            const {
                properties
            } = metadata;

            (child as any).setInheritedProperties(properties, parent);
        }

        /**
         * Sets the properties that can be inherited from the value of the parent if any
         * @param propertiesMetadata 
         */
        protected setInheritedProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>, parent: HTMLElement) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    value,
                    inherit
                } = property;

                if (inherit !== true) {

                    continue; // Not inheritable
                }

                if (this._initiallyUndefinedProperties.has(name) === false) {

                    continue; // Its value was initially set in the attribute markup
                }

                const parentValue = findPropertyValueUp(parent as any, name);

                if (parentValue !== undefined) {

                    this.setProperty(name, parentValue);
                }
                else if (this[name] !== value) { // It is different from the default value

                    this.setProperty(name, parentValue);
                }
            }
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

            if (oldValue === newValue) {

                return; // Nothing to change
            }
            
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

            if (value !== null &&
                value.startsWith(attributeMarkerPrefix)) { // Coming from a template ... ignore

                return false;
            }

            // Verify that the property is one of the configured in the custom element
            let propertyMetadata: CustomElementPropertyMetadata = (this.constructor as any).metadata.propertiesByAttribute.get(attribute);

            const {
                name,
                type,
                transform
            } = propertyMetadata;

            value = valueConverter.toProperty(value, type); // Convert from the value returned by the parameter

            if (transform !== undefined) {

                value = transform.call(this, value); // Transform the data if necessary
            }

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
}