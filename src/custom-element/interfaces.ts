/**
 * Describes the configurator of the component
 */
export interface CustomElementComponentMetadata {

    /**
     * Whether to create a shadow DOM for the component
     * Defaults to true
     */
    shadow?: boolean;
}

/**
 * Describes the configurator of the properties
 */
export interface CustomElementPropertyMetadata {
    /**
     * The name of the property in the props object
     * It corresponds to the key of the record
     */
    name?: string;

    /**
     * The name of the HTML attribute mapped to the property
     */
    attribute?: string;

    /**
     * The type of the property. If not provided it defaults to a string
     */
    type?: Function | Function[];

    /**
     * The default value of the property if no attribute is set in HTML
     */
    value?: any;

    /**
     * Whether the value of the property can be changed
     */
    mutable?: boolean;

    /**
     * Whether to reflect the change of the property in its mapped HTML attribute
     */
    reflect?: boolean;

    /**
     * Whether to request the value of the property in the parent if it is not set in the child. e.g., size, kind, etc.
     */
    inherit?: boolean;

    /**
     * The range to restrict the values of the property
     */
    options?: string[];

    /**
     * Whether the property must have a value by the time the connectedCallback method is called
     */
    required?: boolean;

    /**
     * Hook to allow for conditional initialization of the property when the component is connected
     */
    beforeInitialize?: (value: any) => any;

    /**
     * Called when the property has changed but after the DOM has been updated
     * Used to perform modifications to the DOM after updating it
     */
    afterUpdate?: Function;
}

/**
 * Describes the configurator of the state
 */
export interface CustomElementStateMetadata {

    /**
     * The name of the property in the state object
     */
    name?: string;

    /**
     * The default value of the state
     */
    value: any;
}

/**
 * Contains the merged metadata of this custom component and its ancestors
 * to perform validations of the custom element as well as initialization of its instances
 */
export interface CustomElementMetadata {

    /**
     * Whether to create a shadow DOM for the component
     */
    shadow: boolean;

    /**
     * The merged properties configuration of the custom element mapped by its name.
     * They are indexed by the name of the property
     */
    properties: Map<string, CustomElementPropertyMetadata>;

    /**
     * The merged properties indexed by the name of the attribute
     */
    propertiesByAttribute: Map<string, CustomElementPropertyMetadata>;

    /**
     * The merged observed attributes of the custom element
     */
    observedAttributes: string[];

    /**
     * The merged state configuration of the custom element mapped by its name
     */
    state: Map<string, CustomElementStateMetadata>;

    /**
     * The merged styles of the custom element
     */
    styles: string;
}

export function Callback() {}
