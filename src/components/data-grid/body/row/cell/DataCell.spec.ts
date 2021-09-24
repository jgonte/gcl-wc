import clearCustomElements from "../../../../../custom-element/test/utils/clearCustomElements";
import DataCell from "./DataCell";

beforeEach(() => {

    clearCustomElements();
});

describe("Data cell tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        customElements.define('gcl-data-cell', DataCell as any);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-cell></gcl-data-cell>`;

        }).toThrow(new Error("The attributes: [record, field] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        customElements.define('gcl-data-cell', DataCell as any);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-cell id="dc1" record=\'{ \"name\": \"Sarah\" }\' field="name"></gcl-data-cell>';

        // Test the element
        const component: any = document.querySelector('gcl-data-cell');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`Sarah<style>
:host {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;
}</style>`);
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as any).getRecord = function() {

            return {
                name: "Sarah",
                reputation: 9,
                description: 'Smart and beautiful'
            };
        };
  
        (window as any).getField = function () {

            return "name";
        };

        // Re-register the data cell since all the custom elements are cleared before any test
        customElements.define('gcl-data-cell', DataCell as any);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-cell id="dc2" record="getRecord()" field="getField()"></gcl-data-cell>';

        // Test the element
        const component: any = document.querySelector('gcl-data-cell');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`Sarah<style>
:host {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0.5em;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0px;
    white-space: nowrap;
}</style>`);
    });
});