import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import DataCell from "./body/row/cell/DataCell";
import DataRow from "./body/row/DataRow";
import DataGrid from "./DataGrid";

beforeEach(() => {

    clearCustomElements();
});

describe("Data grid tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data grid and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);

        defineCustomElement('gcl-data-row', DataRow);

        defineCustomElement('gcl-data-grid', DataGrid);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-grid></gcl-data-grid>`;

        }).toThrow(new Error("The attributes: [data, fields] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);

        defineCustomElement('gcl-data-row', DataRow);

        defineCustomElement('gcl-data-grid', DataGrid);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcl-data-grid id="dg1" 
            data='[{ "name": "Sarah", "age": "19", "description": "Beautiful and smart" }, { "name": "Mark", "age": "31", "description": "Hard worker" }]'
            fields='[ "name", "age", "description" ]'
        >
        </gcl-data-grid>`;

        // Test the element
        const component: any = document.querySelector('gcl-data-grid');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<gcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcl-data-header><!----><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:&#x22;19&#x22;,&#x22;description&#x22;:&#x22;Beautiful and smart&#x22;}\" key=\"tbd\"></gcl-data-row><!----><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:&#x22;31&#x22;,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"tbd\"></gcl-data-row><!----><style>[object Object]</style>`);
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as any).getData = function () {

            return [
                {
                    name: "Sarah",
                    age: 19,
                    description: 'Smart and beautiful'
                },
                {
                    name: "Mark",
                    age: 31,
                    description: 'Hard worker'
                }
            ];
        };

        (window as any).getFields = function () {

            return ["name", "age", "description"];
        };

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);

        defineCustomElement('gcl-data-row', DataRow);

        defineCustomElement('gcl-data-grid', DataGrid);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-grid id="dg2" data="getData()" fields="getFields()"></gcl-data-grid>';

        // Test the element
        const component: any = document.querySelector('gcl-data-grid');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<gcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcl-data-header><!----><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"tbd\"></gcl-data-row><!----><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"tbd\"></gcl-data-row><!----><style>[object Object]</style>`);
    });
});