import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import DataGrid from "./DataGrid";

beforeEach(() => {

    clearCustomElements();
});

describe("Data grid tests", () => {

    it('should render the HTML with the default property', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        customElements.define('gcl-data-grid', DataGrid as any);
        
        // Attach it to the DOM
        document.body.innerHTML = `<gcl-data-grid></gcl-data-grid>`;

        // Test the element
        const component: any = document.querySelector('gcl-data-grid');

        await component.updateComplete; // Wait for the component to render

        // expect(component.shadowRoot.innerHTML).toBe(``);
    });
});