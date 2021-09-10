//import { ElementNode } from 'gclib-vdom';
import oneOf from '../../helpers/oneOf';

(window as any).getFields = () => { };

describe("OneOf tests", () => {

    it('should return a function', () => {

        const type = oneOf(Object, Function);

        const value = "getFields()";

        const property = type.toProperty(value);

        expect(property).toEqual((window as any).getFields);
    });

    it('should return an object', () => {

        const type = oneOf(Object, Function);

        const value = '{ "name" : "Sarah" }';

        const property = type.toProperty(value);

        expect(property).toEqual({ name: "Sarah" });
    });

    it('should throw an error because we are asking for an array but returned an object', () => {

        const type = oneOf(Array, Function);

        const value = '{ "name" : "Sarah" }';

        try {

            type.toProperty(value);
        }
        catch (e) {

            expect(e.message).toBe('value: { \"name\" : \"Sarah\" } is not an array but there is no object type expected');
        }
    });

    it('should return an array', () => {

        const type = oneOf(Array, Function);

        const value = '[{ "name" : "Sarah" }, { "name" : "Mark" }]';

        const property = type.toProperty(value);

        expect(property).toEqual([
            { name: "Sarah" },
            { name: "Mark" }
        ]);
    });

    it('should throw an error because we are asking for an object but returned an array', () => {

        const type = oneOf(Object, Function);

        const value = '[{ "name" : "Sarah" }, { "name" : "Mark" }]';

        try {

            type.toProperty(value);
        }
        catch (e) {

            expect(e.message).toBe('value: [{ "name" : "Sarah" }, { "name" : "Mark" }] is an array but there is no array type expected');
        }
    });

    it('should return a string', () => {

        const type = oneOf(Array, Function, String);

        const value = 'Some string';

        const property = type.toProperty(value);

        expect(property).toEqual('Some string');
    });

    // it('should return an element node', () => {

    //     const type = oneOf(ElementNode, Function);

    //     const value = '<span>Text</span>';

    //     const property = type.toProperty(value);

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

        const type = oneOf(Boolean, Function);

        const value = 'false';

        const property = type.toProperty(value);

        expect(property).toEqual(false);
    });

    it('should return a boolean true', () => {

        const type = oneOf(Boolean, Function);

        const value = 'true';

        const property = type.toProperty(value);

        expect(property).toEqual(true);
    });

    it('should return a number', () => {

        const type = oneOf(Number, Function);

        const value = '26';

        const property = type.toProperty(value);

        expect(property).toEqual(26);
    });
});