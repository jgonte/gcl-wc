import valueConverter from "../../helpers/valueConverter";

(window as any).getFields = () => { };

describe("Value converter to property tests", () => {

    it('should return a function', () => {

        const type = [Object, Function];

        const value = "getFields()";

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual((window as any).getFields);
    });

    it('should return an object', () => {

        const type = [Object, Function];

        const value = '{ "name" : "Sarah" }';

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual({ name: "Sarah" });
    });

    it('should throw an error because we are asking for an array but returned an object', () => {

        const type = [Array, Function];

        const value = '{ "name" : "Sarah" }';

        try {

            valueConverter.toProperty(value, type);
        }
        catch (e) {

            expect(e.message).toBe('value: { \"name\" : \"Sarah\" } is not an array but there is no object type expected');
        }
    });

    it('should return an array', () => {

        const type = [Array, Function];

        const value = '[{ "name" : "Sarah" }, { "name" : "Mark" }]';

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual([
            { name: "Sarah" },
            { name: "Mark" }
        ]);
    });

    it('should throw an error because we are asking for an object but returned an array', () => {

        const type = [Object, Function];

        const value = '[{ "name" : "Sarah" }, { "name" : "Mark" }]';

        try {

            valueConverter.toProperty(value, type);
        }
        catch (e) {

            expect(e.message).toBe('value: [{ "name" : "Sarah" }, { "name" : "Mark" }] is an array but there is no array type expected');
        }
    });

    it('should return a string', () => {

        const type = [Array, Function, String];

        const value = 'Some string';

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual('Some string');
    });

    // it('should return an element node', () => {

    //     const type = [ElementNode, Function];

    //     const value = '<span>Text</span>';

    //     const property = valueConverter.toProperty(value, type);

    //     expect(property).toEqual({
    //         children: [
    //             {
    //                 isText: true,
    //                 text: "Text",
    //             }
    //         ],
    //         isElement: true,
    //         name: "span",
    //         props: null
    //     });
    // });

    it('should return a boolean false', () => {

        const type = [Boolean, Function];

        const value = 'false';

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual(false);
    });

    it('should return a boolean true', () => {

        const type = [Boolean, Function];

        const value = 'true';

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual(true);
    });

    it('should return a number', () => {

        const type = [Number, Function];

        const value = '26';

        const property = valueConverter.toProperty(value, type);

        expect(property).toEqual(26);
    });
});