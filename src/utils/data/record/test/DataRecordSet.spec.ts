import DataRecordDescriptor from '../DataRecordDescriptor';
import DataRecordSet from '../DataRecordSet';

const recordDescriptorWithId = new DataRecordDescriptor();

recordDescriptorWithId.fromModel({
    id: {
        isId: true,
        type: Number
    },
    iq: {
        type: Number
    },
    name: {
        type: String
    },
    dob: {
        type: Date
    },
    isActive: {
        type: Boolean
    }
});

const recordDescriptorWithNoId = new DataRecordDescriptor();

recordDescriptorWithNoId.fromModel({
    iq: {
        type: Number
    },
    name: {
        type: String
    },
    dob: {
        type: Date
    },
    isActive: {
        type: Boolean
    }
});

describe("DataRecordSet tests", () => {

    it("should modify the record with set when there is an id match", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        dataRecordSet.set({
            id: 2,
            iq: 250,
            name: 'Jorgito',
            dob: new Date(1938, 3, 4),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 3, 4),
                isActive: false
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([]);

        expect(changedRecords.modifiedRecords).toEqual([{
            id: 2,
            iq: 250,
            name: 'Jorgito',
            dob: new Date(1938, 3, 4),
            isActive: false
        }]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 3, 4),
                isActive: false
            }
        ]);
    });

    it("should add the record with set when there is no id match", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            id: 3,
            iq: 250,
            name: 'Isaac',
            dob: new Date(1643, 1, 4),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 3,
                iq: 250,
                name: 'Isaac',
                dob: new Date(1643, 1, 4),
                isActive: false
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([{
            id: 3,
            iq: 250,
            name: 'Isaac',
            dob: new Date(1643, 1, 4),
            isActive: false
        }]);

        expect(changedRecords.modifiedRecords).toEqual([]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 3,
                iq: 250,
                name: 'Isaac',
                dob: new Date(1643, 1, 4),
                isActive: false
            }
        ]);
    });

    it("should blindly add a record no id fields in the descriptor unless the added record is equivalent to an existing one", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 250,
            name: 'Isaac',
            dob: new Date(1643, 1, 4),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 250,
                name: 'Isaac',
                dob: new Date(1643, 1, 4),
                isActive: false
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([{
            iq: 250,
            name: 'Isaac',
            dob: new Date(1643, 1, 4),
            isActive: false
        }]);

        expect(changedRecords.modifiedRecords).toEqual([]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 250,
                name: 'Isaac',
                dob: new Date(1643, 1, 4),
                isActive: false
            }
        ]);

    });

    it("should not add a record no id fields in the descriptor when the added record is equivalent to an existing one", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords).toEqual(undefined); // Since there is nothing to commit, the callback is not called

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

    });

    it("should blindly add a record when there is id fields in the descriptor but the record has the id field undefined unless the record is equivalent to an existing one", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 250,
            name: 'Isaac',
            dob: new Date(1643, 1, 4),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 250,
                name: 'Isaac',
                dob: new Date(1643, 1, 4),
                isActive: false
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([{
            iq: 250,
            name: 'Isaac',
            dob: new Date(1643, 1, 4),
            isActive: false
        }]);

        expect(changedRecords.modifiedRecords).toEqual([]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 250,
                name: 'Isaac',
                dob: new Date(1643, 1, 4),
                isActive: false
            }
        ]);
    });

    it("should not add a record when there is id fields in the descriptor and the record has the id field undefined but the record is equivalent to an existing one", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 200,
            name: 'Jorge',
            dob: new Date(1928, 4, 14),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords).toEqual(undefined);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

    });

    it("should update a record with different information when it has an id", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.update(
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 2,
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 5, 15),
                isActive: true
            }
        );

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 5, 15),
                isActive: true
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([]);

        expect(changedRecords.modifiedRecords).toEqual([{
            id: 2,
            iq: 250,
            name: 'Jorgito',
            dob: new Date(1938, 5, 15),
            isActive: true
        }]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 5, 15),
                isActive: true
            }
        ]);

    });

    it("should update a record with different information when there are no id fields in the record descriptor", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.update(
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {

                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 5, 15),
                isActive: true
            }
        );

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 5, 15),
                isActive: true
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([]);

        expect(changedRecords.modifiedRecords).toEqual([{
            iq: 250,
            name: 'Jorgito',
            dob: new Date(1938, 5, 15),
            isActive: true
        }]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 5, 15),
                isActive: true
            }
        ]);

    });

    it("should un-modify the record with set when there is an id match but after the set is called with the initial data", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        dataRecordSet.set({
            id: 2,
            iq: 250,
            name: 'Jorgito',
            dob: new Date(1938, 3, 4),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 250,
                name: 'Jorgito',
                dob: new Date(1938, 3, 4),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            id: 2,
            iq: 200,
            name: 'Jorge',
            dob: new Date(1928, 4, 14),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords).toEqual(undefined);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

    });

    it("should a remove a record by calling remove", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        dataRecordSet.remove({
            id: 1,
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([]);

        expect(changedRecords.modifiedRecords).toEqual([]);

        expect(changedRecords.removedRecords).toEqual([{
            id: 1,
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        }]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: true
            }
        ]);

    });

    it("should restore the previous state by setting a record that was previously removed", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.remove({
            id: 1,
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            id: 1,
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords).toEqual(undefined);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
        ]);

    });

    it("should restore the previous state by setting a record that was previously removed even the record have no id fields", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.remove({
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 1000,
            name: 'Flora',
            dob: new Date(1928, 4, 24),
            isActive: true
        });

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords).toEqual(undefined);
        
        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
        ]);

    });

    it("should keep the record modified when a modified record is removed and set again", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        // Modify
        dataRecordSet.set({
            id: 1,
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 1,
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.remove({
            id: 1,
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            id: 1,
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 1,
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([]);

        expect(changedRecords.modifiedRecords).toEqual([{
            id: 1,
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        }]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                id: 2,
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                id: 1,
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
        ]);

    });

    it("should keep the record modified when a modified record is removed and set again even with no ids", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        // Modify
        dataRecordSet.update(
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            }
        );

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
        ]);

        dataRecordSet.remove({
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([]);

        expect(changedRecords.modifiedRecords).toEqual([{
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        }]);

        expect(changedRecords.removedRecords).toEqual([]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
        ]);

    });

    it("should reset to the initial data on the records regardless of the operations done to the record set", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 50,
            name: 'Paco',
            dob: new Date(1958, 5, 25),
            isActive: true
        });

        // Modify
        dataRecordSet.update(
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            }
        );

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
            {
                iq: 50,
                name: 'Paco',
                dob: new Date(1958, 5, 25),
                isActive: true
            }
        ]);

        dataRecordSet.remove({
            iq: 200,
            name: 'Jorge',
            dob: new Date(1928, 4, 14),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
            {
                iq: 50,
                name: 'Paco',
                dob: new Date(1958, 5, 25),
                isActive: true
            }
        ]);

        dataRecordSet.reset();

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

    });

    it("should commit the changes using a callback and reset to the initial data on the records regardless of the operations done to the record set", () => {

        const dataRecordSet = new DataRecordSet(recordDescriptorWithNoId);

        expect(dataRecordSet.getData()).toEqual([]);

        dataRecordSet.initialize([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            }
        ]);

        dataRecordSet.set({
            iq: 50,
            name: 'Paco',
            dob: new Date(1958, 5, 25),
            isActive: true
        });

        // Modify
        dataRecordSet.update(
            {
                iq: 1000,
                name: 'Flora',
                dob: new Date(1928, 4, 24),
                isActive: true
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            }
        );

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 200,
                name: 'Jorge',
                dob: new Date(1928, 4, 14),
                isActive: false
            },
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
            {
                iq: 50,
                name: 'Paco',
                dob: new Date(1958, 5, 25),
                isActive: true
            }
        ]);

        dataRecordSet.remove({
            iq: 200,
            name: 'Jorge',
            dob: new Date(1928, 4, 14),
            isActive: false
        });

        expect(dataRecordSet.isModified).toEqual(true);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
            {
                iq: 50,
                name: 'Paco',
                dob: new Date(1958, 5, 25),
                isActive: true
            }
        ]);

        let changedRecords: any = undefined;

        dataRecordSet.commit((addedRecords, modifiedRecords, removedRecords) => {

            changedRecords = {
                addedRecords,
                modifiedRecords,
                removedRecords
            }
        });

        expect(changedRecords.addedRecords).toEqual([{
            iq: 50,
            name: 'Paco',
            dob: new Date(1958, 5, 25),
            isActive: true
        }]);

        expect(changedRecords.modifiedRecords).toEqual([{
            iq: 1200,
            name: 'Florita',
            dob: new Date(1925, 5, 25),
            isActive: false
        }]);

        expect(changedRecords.removedRecords).toEqual([{
            iq: 200,
            name: 'Jorge',
            dob: new Date(1928, 4, 14),
            isActive: false
        }]);

        expect(dataRecordSet.isModified).toEqual(false);

        expect(dataRecordSet.getData()).toEqual([
            {
                iq: 1200,
                name: 'Florita',
                dob: new Date(1925, 5, 25),
                isActive: false
            },
            {
                iq: 50,
                name: 'Paco',
                dob: new Date(1958, 5, 25),
                isActive: true
            }
        ]);

    });

});