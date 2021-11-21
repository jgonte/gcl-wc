import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import App from "./App";

beforeEach(() => {

    clearCustomElements();
});

describe("App tests", () => {

    it('should render the empty app', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcl-app', App);

        // Attach it to the DOM
        document.body.innerHTML = `<gcl-app></gcl-app>`;

        // Test the element
        const component: any = document.querySelector('gcl-app');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<!--_$node_--><slot></slot>`);
    });

    it('should render the errors', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcl-app', App);

        // Attach it to the DOM
        document.body.innerHTML = `<gcl-app></gcl-app>`;

        // Test the element
        const component: any = document.querySelector('gcl-app');

        component.errors = [
            {
                message: 'error 1'
            },
            {
                message: 'error 2'
            }
        ];

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<gcl-overlay><span>error 1<!--_$node_--></span><span>error 2<!--_$node_--></span><!--_$node_--></gcl-overlay><!--_$node_--><slot></slot>`);
    });

});