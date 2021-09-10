import { defineCustomElement } from "../../..";
import clearCustomElements from "../utils/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("defineCustomElement tests", () => {

    it('should define a custom element more than once without errors', () => {

        class A extends HTMLElement { };

        defineCustomElement('test-a', A);

        defineCustomElement('test-a', A);

        expect(true).toEqual(true);
    });

});
