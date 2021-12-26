import Validator from "../Validator";
import { ValidationContext } from "../../interfaces";
import { DataProvider } from "../../../data/record/interfaces";

export interface RecordValidationContext extends ValidationContext {

    dataProvider: DataProvider;
}

export default abstract class RecordValidator extends Validator {

    abstract validate(context: RecordValidationContext): boolean;

    getData(context: RecordValidationContext): any {

        return context.dataProvider.getData();
    }
}