import clearCustomElements from "../../../../custom-element/test/utils/clearCustomElements";
import DataCell from "./cell/DataCell";
import DataRow from "./DataRow";

beforeEach(() => {

    clearCustomElements();
});

describe("Data row tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data row and its dependencies since all the custom elements are cleared before any test
        customElements.define('gcl-data-cell', DataCell as any);

        customElements.define('gcl-data-row', DataRow as any);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-row></gcl-data-row>`;

        }).toThrow(new Error("The attributes: [record, fields] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data row since all the custom elements are cleared before any test
        customElements.define('gcl-data-cell', DataCell as any);

        customElements.define('gcl-data-row', DataRow as any);

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

        expect(component.shadowRoot.innerHTML).toBe(``);
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
        customElements.define('gcl-data-cell', DataCell as any);
        
        customElements.define('gcl-data-row', DataRow as any);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-row id="dr2" record="getRecord()" fields="getFields()"></gcl-data-row>';

        // Test the element
        const component: any = document.querySelector('gcl-data-row');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(``);
    });
});