import { ComparisonOperatorsEnum } from "../../../../utils/operators/ComparisonOperatorsEnum";
import { ValidatorOptions } from "../Validator";
import RecordValidator, { RecordValidationContext } from "./RecordValidator";

export interface CompareValidatorOptions extends ValidatorOptions {

    /**
     * The name of the property to validate
     */
    propertyToValidate: string;

    /**
     * The name of the property to compare against
     */
    propertyToCompare: string;

    /**
     * The operator to perform the comparison
     */
    operator: ComparisonOperatorsEnum;
}

export default class CompareValidator extends RecordValidator {

    private _propertyToValidate: string;

    private _propertyToCompare: string;

    private _operator: ComparisonOperatorsEnum;

    constructor(options: CompareValidatorOptions) {

        super(options);

        this._propertyToValidate = options.propertyToValidate;

        this._propertyToCompare = options.propertyToCompare;

        this._operator = options.operator;
    }

    validate(context: RecordValidationContext): boolean {

        const {
            _propertyToValidate,
            _propertyToCompare,
            _operator
        } = this;

        const data = this.getData(context);

        const valueToValidate = data[_propertyToValidate];

        const valueToCompare = data[_propertyToCompare];

        const valid = this._compare(valueToValidate, valueToCompare, _operator);

        if (!valid) {

            this.emitErrors(context, {
                propertyToValidate: _propertyToValidate,
                valueToValidate,
                propertyToCompare: _propertyToCompare,
                valueToCompare,
                operator: _operator
            });
        }

        return valid;
    }
    
    private _compare(valueToValidate: any, valueToCompare: any, operator: ComparisonOperatorsEnum) : boolean {

        switch(operator) {
            case ComparisonOperatorsEnum.Equal: return valueToValidate === valueToCompare;
            case ComparisonOperatorsEnum.NotEqual: return valueToValidate !== valueToCompare;
            case ComparisonOperatorsEnum.GreaterThan: return valueToValidate > valueToCompare;
            case ComparisonOperatorsEnum.GreaterOrEqual: return valueToValidate >= valueToCompare;
            case ComparisonOperatorsEnum.LessThan: return valueToValidate < valueToCompare;
            case ComparisonOperatorsEnum.LessThanOrEqual: return valueToValidate <= valueToCompare;
            default:throw Error(`Invalid comparison operator: ${operator}`);
        }
    }
    
}