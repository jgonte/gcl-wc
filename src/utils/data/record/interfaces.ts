import ValueConverter from "../converter/interfaces";

export interface DataFieldModel {

    /**
     * Whether the field is an identifier of the record
     */
    isId?: boolean;

    /**
     * The type of the field
     */
    type: Function;

    /**
     * The default value of the field
     */
    value?: any;

    /**
     * The converter to convert the value if the value comes as a string
     */
    converter?: ValueConverter;

    // /**
    //  * The validators of the field
    //  */
    // validators?: (Validator | ValidatorConfig)[];

    // /**
    //  * The validation failed handler (which is generally the field component)
    //  */
    // validationFailedHandler: ValidationFailedHandler;
}

export interface DataFieldDescriptor extends DataFieldModel {

    /**
     * The name of the field
     */
    name: string;
}

export interface IdentifierInfo {

    /**
     * The value of the identifier
     */
    value: any;

    /**
     * Whether there is no id field in the field descriptors
     */
    noDescriptorsId: boolean;

    /**
     * Whether has id fields in the field descriptors but one or more id field values are undefined
     */
    hasUndefinedIdentifiers: boolean;
}

export interface IDataField {

    readonly name: string;

    readonly value: any;
}

export interface DataProvider {

    getData(): any;
}

export interface DataSetter {

    setData(data: any): void;
}
