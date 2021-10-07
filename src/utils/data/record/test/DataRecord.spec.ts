import DataRecord from '../DataRecord';
import DataRecordDescriptor from '../DataRecordDescriptor';

describe("DataRecord tests", () => {

    // it("should support the operations of a DataRecord with commit", () => {

    //     const recordDescriptor = new DataRecordDescriptor();

    //     recordDescriptor.fromModel({
    //         field1: {
    //             isId: true,
    //             type: String,
    //             value: 'field1'
    //         },
    //         field2: {
    //             type: Number,
    //             value: 3
    //         },
    //         field3: {
    //             type: Date,
    //             value: new Date(2002, 4, 25)
    //         },
    //         field4: {
    //             type: Boolean,
    //             value: true
    //         }
    //     });

    //     const dataRecord = new DataRecord(recordDescriptor);

    //     expect(dataRecord.getData()).toEqual({
    //         field1: "field1",
    //         field2: 3,
    //         field3: new Date(2002, 4, 25),
    //         field4: true
    //     });

    //     expect(dataRecord.isModified).toEqual(false);

    //     dataRecord.setData({
    //         field1: "field11",
    //         field2: 32,
    //         field3: new Date(1928, 4, 24),
    //         field4: false
    //     });

    //     expect(dataRecord.isModified).toEqual(true);

    //     // Verify it returns the changed data
    //     expect(dataRecord.getData()).toEqual({
    //         field1: "field11",
    //         field2: 32,
    //         field3: new Date(1928, 4, 24),
    //         field4: false
    //     });

    //     let record = undefined;

    //     dataRecord.commit(r => {

    //         record = r;
    //     });

    //     expect(record).toEqual({
    //         field1: "field11",
    //         field2: 32,
    //         field3: new Date(1928, 4, 24),
    //         field4: false
    //     });

    //     // Verify the record is not modified when commit
    //     expect(dataRecord.isModified).toEqual(false);

    //     // Verify it returns the initial data
    //     expect(dataRecord.getData()).toEqual({
    //         field1: "field11",
    //         field2: 32,
    //         field3: new Date(1928, 4, 24),
    //         field4: false
    //     });
    // });

    it("should support the operations of a DataRecord with reset", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            field1: {
                isId: true,
                type: String,
                value: 'field1'
            },
            field2: {
                type: Number,
                value: 3
            },
            field3: {
                type: Date,
                value: new Date(2002, 4, 25)
            },
            field4: {
                type: Boolean,
                value: true
            }
        });

        const dataRecord = new DataRecord(recordDescriptor);

        expect(dataRecord.getData()).toEqual({
            field1: "field1",
            field2: 3,
            field3: new Date(2002, 4, 25),
            field4: true
        });

        expect(dataRecord.isModified).toEqual(false);

        dataRecord.setData({
            field1: "field11",
            field2: 32,
            field3: new Date(1928, 4, 24),
            field4: false
        });

        expect(dataRecord.isModified).toEqual(true);

        // Verify it returns the changed data
        expect(dataRecord.getData()).toEqual({
            field1: "field11",
            field2: 32,
            field3: new Date(1928, 4, 24),
            field4: false
        });

        dataRecord.reset();

        // Verify the record is not modified when reset
        expect(dataRecord.isModified).toEqual(false);

        // Verify it returns the initial data
        expect(dataRecord.getData()).toEqual({
            field1: "field1",
            field2: 3,
            field3: new Date(2002, 4, 25),
            field4: true
        });
    });

    // it("should throw an error when the record descriptor is null", () => {

    //     let hasError = false;

    //     try {

    //         const dataRecord = new DataRecord(undefined);
    //     }
    //     catch (error) {

    //         hasError = true;
    //     }

    //     expect(hasError).toEqual(true);
    // });

    it("should convert the values if necessary", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            field1: {
                isId: true,
                type: String,
                value: 'field1'
            },
            field2: {
                type: Number,
                value: 3
            },
            field3: {
                type: Date,
                value: new Date(2002, 4, 25)
            },
            field4: {
                type: Boolean,
                value: true
            }
        });

        const dataRecord = new DataRecord(recordDescriptor);

        // Simulate an API web response with fields being returned with string values
        const response = JSON.parse('{"field1":"field1","field2":"3","field3":"2002-05-25T04:00:00.000Z","field4":"true"}');

        dataRecord.initialize(response);

        // Verify that when initialized is not modified
        expect(dataRecord.isModified).toEqual(false);

        // Verify it returns the initial data
        expect(dataRecord.getData()).toEqual({
            field1: "field1",
            field2: 3,
            field3: new Date(2002, 4, 25),
            field4: true
        });

    });

    // it("should validate the record", () => {

    //     const recordDescriptor = new DataRecordDescriptor();

    //     let validationError;

    //     const validationFailedHandler: ValidationFailedHandler = {

    //         onValidationFailed(error) {

    //             validationError = error;
    //         }
    //     };

    //     recordDescriptor.fromModel({
    //         field1: {
    //             isId: true,
    //             type: String,
    //             //value: 'field1'
    //         },
    //         field2: {
    //             type: Number,
    //             value: 3
    //         },
    //         field3: {
    //             type: Date,
    //             value: new Date(2002, 4, 25)
    //         },
    //         field4: {
    //             type: Boolean,
    //             value: true
    //         },
    //         field5: {
    //             type: Number,
    //             value: 4
    //         }
    //     },
    //         new CompareValidator({
    //             message: 'Field2 and Field4 must have equal values',
    //             propertyToValidate: 'field2',
    //             propertyToCompare: 'field5',
    //             operator: ComparisonOperators.Equal
    //         })
    //     );

    //     const dataRecord = new DataRecord(recordDescriptor);

    //     dataRecord.initialize({
    //         field1: ''
    //     });

    //     const validationContext = {
    //         errors: [],
    //         stopWhenInvalid: true
    //     };

    //     expect(dataRecord.validate(validationContext)).toEqual(false);

    //     expect(validationContext.errors.length).toEqual(2);

    //     expect(validationContext.errors[0]).toEqual('Field1 is required');

    //     expect(validationError).toEqual('Field1 is required');

    //     expect(validationContext.errors[1]).toEqual('Field2 and Field4 must have equal values');
    // });
});