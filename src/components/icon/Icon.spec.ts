import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import Icon from "./Icon";

beforeEach(() => {

    clearCustomElements();
});

describe("Icon tests", () => {

    it('should throw an error when the name is not provided', () => {

        // Re-register the components since all the custom elements are cleared before any test
        defineCustomElement('gcl-icon', Icon);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-icon></gcl-icon>`;

        }).toThrow(new Error("The attributes: [name] must have a value"));
    });

    it('should render empty icon', async () => {

        // Re-register the components since all the custom elements are cleared before any test
        defineCustomElement('gcl-icon', Icon);

        // Attach it to the DOM
        document.body.innerHTML = `<gcl-icon name="alarm"></gcl-icon>`;

        // Test the element
        const component: any = document.querySelector('gcl-icon');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<style>[object Object]</style><svg role=\"img\">
                <use href=\"lib/components/assets/icons/bootstrap-icons.svg#alarm\"/></svg>`);
    });

});