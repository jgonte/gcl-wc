import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import Overlay from "./Overlay";

beforeEach(() => {

    clearCustomElements();
});

describe("Overlay tests", () => {

    it('should render empty overlay', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcl-overlay', Overlay);

        // Attach it to the DOM
        document.body.innerHTML = `<gcl-overlay></gcl-overlay>`;

        // Test the element
        const component: any = document.querySelector('gcl-overlay');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<style>[object Object]</style><slot></slot>`);
    });

});