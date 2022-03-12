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

    it('should return true when the values of the node patching data are equivalent ', () => {

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

});