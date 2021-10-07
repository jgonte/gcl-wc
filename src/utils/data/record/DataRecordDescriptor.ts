import { DataFieldModel, DataFieldDescriptor, IdentifierInfo } from "./interfaces";
import defaultValueConverter from "../converter/defaultValueConverter";
//import RecordValidator from "../validation/validators/record/RecordValidator";

class RecordValidator {
    
}

function getType(value: any): Function {

    const type = typeof value;

    switch (type) {
        case 'boolean': return Boolean;
        case 'number': return Number;
        case 'bigint': return BigInt;
        case 'string': return String;
        case 'object': {

            if (value instanceof Date) {

                return Date;
            }
            else {

                throw Error(`Not implemented for type: '${type}'`);
            }
        }
        default: throw Error(`Not implemented for type: '${type}'`);
        // "symbol" | "undefined" | "function"
    }
}

export default class DataRecordDescriptor {

    /**
     * The descriptors of the field of the record
     */
    private _fieldDescriptors: DataFieldDescriptor[] = [];

    private _recordValidators?: RecordValidator[];

    get fieldDescriptors() {

        return this._fieldDescriptors;
    }

    get recordValidators() {

        return this._recordValidators;
    }

    getFieldDescriptor(name: string): DataFieldDescriptor | undefined {

        const descriptors = this._fieldDescriptors.filter(d => d.name === name);

        return descriptors.length > 0 ?
            descriptors[0] :
            undefined;
    }

    /**
     * Creates the record descriptor from a model
     * @param model 
     */
    fromModel(model: Record<string, DataFieldModel>, ...recordValidators: RecordValidator[]): void {

        for (const key in model) {

            if (model.hasOwnProperty(key)) {

                const {
                    isId,
                    type,
                    value,
                    converter
                } = model[key];

                this.addFieldDescriptor({
                    name: key,
                    isId: isId ?? false,
                    type: type !== undefined ? type : value !== undefined ?
                        getType(value) : String,
                    value,
                    converter: converter || defaultValueConverter
                });
            }
        }

        this._recordValidators = recordValidators;
    }

    addFieldDescriptor(fd: DataFieldDescriptor): void {

        // Set the default converter if none are provided
        if (fd.converter === undefined) {

            fd.converter = defaultValueConverter;
        }

        this._fieldDescriptors.push(fd);
    }

    removeFieldDescriptor(fd: DataFieldDescriptor): void {

        const index = this._fieldDescriptors.indexOf(fd);

        if (index > -1) {

            this._fieldDescriptors.splice(index, 1);
        }  
    }

    /**
     * Creates an id object from the data using the field descriptors id property
     * @param data 
     * @param fcn A function to process the data further if necessary
     */
    getId(data: any, fcn?: Function): IdentifierInfo {

        const id: Record<string, any> = {};

        const idDescriptors = this._fieldDescriptors.filter(f => f.isId === true);

        const { length } = idDescriptors;

        let hasUndefinedIdentifiers = false;

        if (length > 0) { // There are some field(s) that compose an identifier

            for (let i = 0; i < length; ++i) {

                const descriptor = idDescriptors[i];

                const {
                    name
                } = descriptor;

                if (data.hasOwnProperty(name)) {

                    const value = fcn !== undefined ? fcn(data[name]) : data[name];

                    if (value === undefined) {

                        hasUndefinedIdentifiers = true;

                        break;
                    }

                    id[name] = value;
                }
                else { // No data property for that id descriptor

                    id[name] = undefined;

                    hasUndefinedIdentifiers = true;

                    break;
                }
            }

            if (hasUndefinedIdentifiers) { // No field serves a an identifier, create one using all the fields for (hopefully) uniqueness

                for (const key in data) {

                    if (data.hasOwnProperty(key)) {

                        const value = fcn !== undefined ? fcn(data[key]) : data[key];

                        id[key] = value;
                    }
                }
            }

        }
        else { // No field serves a an identifier, create one using all the fields for (hopefully) uniqueness

            for (const key in data) {

                if (data.hasOwnProperty(key)) {

                    const value = fcn !== undefined ? fcn(data[key]) : data[key];

                    id[key] = value;
                }
            }
        }

        return {
            value: id,
            noDescriptorsId: length === 0,
            hasUndefinedIdentifiers: length > 0 && hasUndefinedIdentifiers === true
        };
    }
}