/**
 * Describes the configurator of the properties
 */
export interface CustomElementPropertyMetadata {
    /**
     * The name of the property in the props object
     */
    name: string;

    /**
     * The name of the HTML attribute mapped to the property
     */
    attribute: string;

    /**
     * The type of the property
     */
    type: Function;

    /**
     * The default value of the property if no attribute is set in HTML
     */
    value: any;

    /**
     * Whether the value of the property can be changed
     */
    mutable: boolean;

    /**
     * Whether to reflect the change of the property in its mapped HTML attribute
     */
    reflect: boolean;

    /**
     * Whether the value of the parent property needs to be passed th the children nodes when they are initialized
     */
    passToChildren: boolean;

    /**
     * The range to restrict the values of the property
     */
    options: string[];

    /**
     * Whether the property must have a value by the time the connectedCallback method is called
     */
    required: boolean;
}

/**
 * Describes the configurator of the state
 */
export interface CustomElementStateMetadata {

    /**
     * The name of the property in the state object
     */
     name: string;

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

    //component: CustomElementDescriptor;

    /**
     * The merged properties configuration of the custom element mapped by its name
     */
    properties: Map<string, CustomElementPropertyMetadata>;

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
    styles: string | string[];
}
