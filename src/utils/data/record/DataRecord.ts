import Subscriber from "../../observer/Subscriber";
import DataField from "./DataField";
import DataRecordDescriptor from "./DataRecordDescriptor";
import { DataFieldDescriptor, DataProvider, DataSetter } from "./interfaces";
import areEqual from "../../areEqual";

/**
 * The collection of data fields
 */
export default class DataRecord implements DataProvider, DataSetter, Subscriber {

    private _fields: Record<string, DataField> = {};

    private _modifiedFields: Record<string, DataField> = {};

    private _recordDescriptor: DataRecordDescriptor;

    /**
     * The cached id of the record
     */
    private _id: any;

    /**
     * The cached data of the record
     */
    private _data?: any = undefined;

    constructor(recordDescriptor?: DataRecordDescriptor) {

        this._recordDescriptor = recordDescriptor ?? new DataRecordDescriptor();

        this._recordDescriptor.fieldDescriptors.forEach(fd => this._fields[fd.name] = new DataField(fd, this));
    }

    addField(fd: DataFieldDescriptor): DataField {

        this._recordDescriptor.addFieldDescriptor(fd);

        this._fields[fd.name] = new DataField(fd, this);

        return this._fields[fd.name];
    }

    getField(name: string) {

        return this._fields[name];
    }

    removeField(fd: DataFieldDescriptor) {

        this._recordDescriptor.removeFieldDescriptor(fd);

        delete this._fields[fd.name];
    }

    /**
     * Initializes the data record with the data passed in that matches the field descriptors
     * If the property of the data is not described in the field descriptor, it will be ignored
     * @param data The data to initialize the data record with
     */
    initialize(data: any) {

        const {
            _fields
        } = this;

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                if (_fields.hasOwnProperty(key)) { // The field exists, initialize it

                    _fields[key].initialize(data[key]);
                }
                else {

                    console.warn(`There is no field for property: '${key}' that was passed as data`);
                }

            }
        }

        this._id = undefined;

        this._data = undefined;

        this._modifiedFields = {};
    }

    getData(): any {

        const {
            _data,
            _fields
        } = this;

        if (_data !== undefined) {

            return _data;
        }

        const data: any = {};

        for (const key in _fields) {

            if (_fields.hasOwnProperty(key)) {

                const value = _fields[key].value;

                if (value != undefined && value != null) {

                    data[key] = value;
                }
            }
        }

        this._data = data;

        return data;
    }

    set id(id: any) {

        this._id = id;
    }

    get id() {

        const {
            _fields
        } = this;

        if (this._id === undefined) {

            const idInfo = this._recordDescriptor.getId(_fields, (f: { value: any; }) => f.value);

            this._id = idInfo.value;
        }

        return this._id;
    }

    get isModified() {

        return Object.keys(this._modifiedFields).length > 0;
    }

    setData(data: Record<string, any>): void {

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const field = this._fields[key];

                if (field !== undefined) {

                    field.value = data[key];
                }
                else { // The field does not need to exist for the given data member but let the programmer know it is missing

                    console.warn(`Field of name: '${key}' was not found for data memeber with same name`);
                }
            }
        }

        this._id = undefined;
    }

    reset() {

        if (!this.isModified) {

            return;
        }

        const {
            _fields
        } = this;

        for (const key in _fields) {

            if (_fields.hasOwnProperty(key)) {

                _fields[key].reset();
            }
        }

        //this._modifiedFields = {}; It should be empty
    }

    onValueSet(descriptor: DataFieldDescriptor, value: any, oldValue: any, initialValue: any) {

        if (areEqual(value, oldValue)) {

            return; // Nothing to change
        }

        const {
            name
        } = descriptor;

        const {
            _fields,
            _modifiedFields
        } = this;

        if (!areEqual(value, initialValue)) {

            // Reference the field in the modified set
            _modifiedFields[name] = _fields[name];
        }
        else {

            // Remove it from the modified fields
            delete _modifiedFields[name];
        }

        // Clear the data cache to get new data
        this._data = undefined;
    }

    // commit(callback: (record: any) => void) {

    //     if (!this.isModified) {

    //         return;
    //     }

    //     callback(this._data);

    //     this.initialize(this._data);
    // }
}