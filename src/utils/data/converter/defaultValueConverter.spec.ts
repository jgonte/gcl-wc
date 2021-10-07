import defaultValueConverter from './defaultValueConverter';

describe("defaultValueConverter tests", () => {

    it("should convert from string to boolean and viceversa", () => {

        expect(defaultValueConverter.fromString("true", Boolean)).toEqual(true);

        expect(defaultValueConverter.fromString("false", Boolean)).toEqual(false);

        expect(defaultValueConverter.toString(true, Boolean)).toEqual("true");

        expect(defaultValueConverter.toString(false, Boolean)).toEqual("false");
    });

    it("should convert from string to Date and viceversa", () => {

        expect(defaultValueConverter.fromString("2002-05-25T04:00:00.000Z", Date)).toEqual(new Date(2002, 4, 25));

        expect(defaultValueConverter.toString(new Date(2002, 4, 25), Date)).toEqual("2002-05-25T04:00:00.000Z");
    });

    it("should convert from string to Number and viceversa", () => {

        expect(defaultValueConverter.fromString("1234", Number)).toEqual(1234);

        expect(defaultValueConverter.toString(1234, Number)).toEqual("1234");
    });
});