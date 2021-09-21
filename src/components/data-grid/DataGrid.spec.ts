import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import { config } from "../config";
import DataGrid from "./DataGrid";

beforeEach(() => {

    clearCustomElements();
});

describe("Data grid tests", () => {

    it('should render the HTML with the default property', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        customElements.define(`${config.tagPrefix}-data-grid`, DataGrid as any);
        
        // Attach it to the DOM
        document.body.innerHTML = `<${config.tagPrefix}-data-grid></${config.tagPrefix}-data-grid>`;

        // Test the element
        const component: any = document.querySelector(`${config.tagPrefix}-data-grid`);

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe('table<style>:host{display:flex;flex-flow:columnnowrap;font-size:.8rem;margin:0.5rem;line-height:1.5;border-bottom:1pxsolid#d0d0d0;flex:11auto;}:host{display:flex;flex-flow:columnnowrap;font-size:.8rem;margin:0.5rem;line-height:1.5;border-bottom:1pxsolid#d0d0d0;flex:11auto;}</style>');
    });
});