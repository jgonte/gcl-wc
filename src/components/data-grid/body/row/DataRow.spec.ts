import defineCustomElement from "../../../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../../../custom-element/test/utils/clearCustomElements";
import DataCell from "./cell/DataCell";
import DataRow from "./DataRow";

beforeEach(() => {

    clearCustomElements();
});

describe("Data row tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data row and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);

        defineCustomElement('gcl-data-row', DataRow);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-row></gcl-data-row>`;

        }).toThrow(new Error("The attributes: [record, fields] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data row since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);

        defineCustomElement('gcl-data-row', DataRow);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcl-data-row id="dr1" 
            record='{ "name": "Sarah", "age": "19", "description": "Beautiful and smart" }'
            fields='[ "name", "age", "description" ]'
        >
        </gcl-data-row>`;

        // Test the element
        const component: any = document.querySelector('gcl-data-row');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<style>[object Object]</style><gcl-data-cell field=\"name\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:&#x22;19&#x22;,&#x22;description&#x22;:&#x22;Beautiful and smart&#x22;}\" key=\"name\"></gcl-data-cell><gcl-data-cell field=\"age\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:&#x22;19&#x22;,&#x22;description&#x22;:&#x22;Beautiful and smart&#x22;}\" key=\"age\"></gcl-data-cell><gcl-data-cell field=\"description\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:&#x22;19&#x22;,&#x22;description&#x22;:&#x22;Beautiful and smart&#x22;}\" key=\"description\"></gcl-data-cell>`);
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as any).getRecord = function() {

            return {
                name: "Sarah",
                age: 19,
                description: 'Smart and beautiful'
            };
        };
  
        (window as any).getFields = function () {

            return ["name", "age", "description"];
        };

        // Re-register the data row since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);
        
        defineCustomElement('gcl-data-row', DataRow);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-row id="dr2" record="getRecord()" fields="getFields()"></gcl-data-row>';

        // Test the element
        const component: any = document.querySelector('gcl-data-row');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<style>[object Object]</style><gcl-data-cell field=\"name\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"name\"></gcl-data-cell><gcl-data-cell field=\"age\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"age\"></gcl-data-cell><gcl-data-cell field=\"description\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"description\"></gcl-data-cell>`);
    });
});