export interface ValidatorConfig {

    /** The type of validator to create */
    type: string;
}

export interface ValidationContext {

    /** The error messages */
    errors: string[];

    /** The warning messages */
    warnings: string[];
}

export interface FieldValidationContext extends ValidationContext {

    /** The label of the field */
    label: string;
}