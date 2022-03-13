import areEquivalentValues from "../areEquivalentValues";

describe("areEquivalentValues tests", () => {

    it('should return true when the values of the primitives are equal', () => {

        const value1 = 'Sarah';

        const value2 = 'Sarah';

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return false when the values of the primitives are not equal', () => {

        const value1 = 'Sarah';

        const value2 = 'Mark';

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return false when the values of the primitives are not equal and unde is undefined', () => {

        const value1 = undefined;

        const value2 = 'Mark';

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return true when the values of the primitives are both undefined', () => {

        const value1 = undefined;

        const value2 = undefined;

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return true when the values of the primitives are null and undefined', () => {

        const value1 = undefined;

        const value2 = null;

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return true when the values data are equivalent ', () => {

        const value1 = {
            id: 2,
            description: 'Item 2'
        };

        const value2 = {
            id: 2,
            description: 'Item 2'
        };

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return false when the first value is null ', () => {

        const value1 = null;

        const value2 = {
            id: 2,
            description: 'Item 2'
        };

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return false when the second value is null ', () => {

        const value1 = {
            id: 2,
            description: 'Item 2'
        };

        const value2 = null;

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return false when the one values have an extra property', () => {

        const value1 = {
            id: 2,
            description: 'Item 2'
        };

        const value2 = {
            id: 2,
            description: 'Item 2',
            checked: true
        };

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeFalsy();
    });

    it('should return true when the values have same patcher properties ', () => {

        const patcher = {};

        const value1 = {
            patcher
        };

        const value2 = {
            patcher
        };

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeTruthy();
    });

    it('should return false when the values have different patcher properties ', () => {

        const value1 = {
            patcher: {}
        };

        const value2 = {
            patcher: {}
        };

        const result = areEquivalentValues(value1, value2);

        expect(result).toBeFalsy();
    });

});