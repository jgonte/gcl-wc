import DataRecord from "./DataRecord";
import DataRecordDescriptor from "./DataRecordDescriptor";
import { DataProvider } from "./interfaces";

/**
 * Keeps information about a set of data records
 */
export default class DataRecordSet implements DataProvider {

    private _records: Record<string, DataRecord> = {};

    private _addedRecords: Record<string, DataRecord> = {};

    private _modifiedRecords: Record<string, DataRecord> = {};

    private _removedRecords: Record<string, DataRecord> = {};

    private _recordDescriptor: DataRecordDescriptor;

    /**
     * The cached data of the record set
     */
    private _data?: any[] = undefined;

    constructor(recordDescriptor: DataRecordDescriptor) {

        this._recordDescriptor = recordDescriptor;
    }

    initialize(data: any[]) {

        this._records = {};

        for (let i = 0; i < data.length; ++i) {

            const dataRecord = new DataRecord(this._recordDescriptor);

            dataRecord.initialize(data[i]);

            (this._records as any)[JSON.stringify(dataRecord.id)] = dataRecord;
        }

        this._addedRecords = {};

        this._modifiedRecords = {}; // Records are re-initialized after a commit

        this._removedRecords = {};

        this._data = undefined;
    }

    getData(): any[] {

        const {
            _data,
            _records,
            _addedRecords
        } = this;

        if (_data !== undefined) {

            return _data;
        }

        const data: any[] = [];

        for (const key in _records) {

            data.push(_records[key].getData());
        }

        for (const key in _addedRecords) {

            data.push(_addedRecords[key].getData());
        }

        this._data = data;

        return data;
    }

    get isModified() {

        return Object.keys(this._addedRecords).length > 0 ||
            Object.keys(this._modifiedRecords).length > 0 ||
            Object.keys(this._removedRecords).length > 0;
    }

    findById(id: any): DataRecord | undefined {

        const strId = typeof id === 'string' ?
            id :
            JSON.stringify(id);

        let record = this._records[strId];

        if (record === undefined) {

            record = this._addedRecords[strId];
        }

        return record;
    }

    /**
     * Updates the record if it exists in _records according to an existing identifier.
     * If it does not exist, then adds it to the records
     * @param data The data to insert/update the record with
     */
    set(data: any) {

        const idInfo = this._recordDescriptor?.getId(data)!;

        const {
            value,
            // noDescriptorsId,
            // hasUndefinedIdentifiers
        } = idInfo;

        // Can't do this since we need to add records
        // if (noDescriptorsId || hasUndefinedIdentifiers) {

        //     throw Error('Cannot use "set" when there are no id fields or the values of some/all identifiers are missing in the record');
        // }

        const idStr = JSON.stringify(value);

        const record = this.findById(idStr);

        if (record !== undefined) { // Found

            record.setData(data);

            if (record.isModified) {

                this._modifiedRecords[idStr] = record;
            }
            else { // Remove it from the changed ones

                delete this._modifiedRecords[idStr];
            }
        }
        else { // Not found

            const removedRecord = this._removedRecords[idStr];

            if (removedRecord !== undefined) {

                delete this._removedRecords[idStr];

                // Restore the removed record
                this._records[idStr] = removedRecord;
            }
            else {

                //create a new record
                const newRecord = new DataRecord(this._recordDescriptor);

                newRecord.id = value; // Set the id since it was already generated

                newRecord.initialize(data);

                // Add it to the added bucket so we know what to post to create to the server
                this._addedRecords[idStr] = newRecord;
            }
        }

        this._data = undefined;
    }

    /**
     * Replaces the data of the record that has the old data with the one of the new data
     * It is the only option of updating the record when no identifiers are provided or any
     * composite identifier is missing
     * @param oldData 
     * @param newData 
     */
    update(oldData: any, newData: any) {

        const idInfo = this._recordDescriptor?.getId(oldData)!;

        const {
            value,
            // noDescriptorsId,
            // hasUndefinedIdentifiers
        } = idInfo;

        const idStr = JSON.stringify(value);

        const record = this.findById(idStr);

        if (record !== undefined) {

            if (this._addedRecords[idStr] !== undefined) { // The record shows as added

                record.initialize(newData);

                // Re-index the record
                delete this._addedRecords[idStr];

                const newIdStr = JSON.stringify(record.id);

                this._addedRecords[newIdStr] = record;
            }
            else {

                record.setData(newData);

                // Re-index the record
                delete this._records[idStr];

                const newIdStr = JSON.stringify(record.id);

                this._records[newIdStr] = record;

                if (record.isModified) {

                    this._modifiedRecords[newIdStr] = record;
                }
                else { // Remove it from the changed ones

                    delete this._modifiedRecords[newIdStr];
                }
            }
        }

        this._data = undefined;
    }

    remove(data: any) {

        const idInfo = this._recordDescriptor?.getId(data)!;

        const {
            value,
            // noDescriptorsId,
            // hasUndefinedIdentifiers
        } = idInfo;

        const idStr = JSON.stringify(value);

        const record = this.findById(idStr);

        if (record !== undefined) {

            if (this._addedRecords[idStr] !== undefined) { // The record shows as added

                delete this._addedRecords[idStr];

                // Do not add it to the removed records since it was removed without synchronizing with the back end
            }
            else {

                delete this._records[idStr];

                this._removedRecords[idStr] = record;
            }

            this._data = undefined; // Reset the data
        }
        // else {
        //     // Nothing to remove
        // }

    }

    /**
     * Resets the record set as when the data was initialized
     */
    reset() {

        if (!this.isModified) {

            return;
        }

        // Discard any added records
        this._addedRecords = {};

        // If any removed records, move them to the _records bucket
        for (let key in this._removedRecords) {

            const removedRecord = this._removedRecords[key];

            delete this._removedRecords[key];

            this._records[key] = removedRecord;
        }

        // Reset all the remaining records
        for (let key in this._records) {

            const record = this._records[key];

            record.reset();
        }

        // Clear all the modified records
        this._modifiedRecords = {};

        this._data = undefined;
    }

    commit(callback: (addedRecords: any, modifiedRecords: any, removedRecords: any) => void) {

        if (!this.isModified) {

            return;
        }

        const addedRecords = Object.values(this._addedRecords).map(r => r.getData());

        const modifiedRecords = Object.values(this._modifiedRecords).map(r => r.getData());

        const removedRecords = Object.values(this._removedRecords).map(r => r.getData());

        callback(addedRecords, modifiedRecords, removedRecords);

        // Set the changes as not modified anymore
        this.initialize((this as any)._data);
    }
}