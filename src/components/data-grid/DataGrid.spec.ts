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

        }).toThrow(new Error("The attributes: [fields, id-field] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data grid since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-cell', DataCell);

        defineCustomElement('gcl-data-row', DataRow);

        defineCustomElement('gcl-data-grid', DataGrid);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcl-data-grid id="dg1" id-field="name" 
            data='[{ "name": "Sarah", "age": "19", "description": "Beautiful and smart" }, { "name": "Mark", "age": "31", "description": "Hard worker" }]'
            fields='[ "name", "age", "description" ]'
        >
        </gcl-data-grid>`;

        // Test the element
        const component: any = document.querySelector('gcl-data-grid');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:&quot;19&quot;,&quot;description&quot;:&quot;Beautiful and smart&quot;}\" key=\"Sarah\"></gcl-data-row><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:&quot;31&quot;,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></gcl-data-row><!--_$em_-->");
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
        document.body.innerHTML = '<gcl-data-grid id="dg2" id-field="name" data="getData()" fields="getFields()"></gcl-data-grid>';

        // Test the element
        const component: any = document.querySelector('gcl-data-grid');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\" key=\"Sarah\"></gcl-data-row><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></gcl-data-row><!--_$em_-->");
    });

    it('should swap the records', async () => {

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
        document.body.innerHTML = '<gcl-data-grid id="dg2"  id-field="name" data="getData()" fields="getFields()"></gcl-data-grid>';

        // Test the element
        const component: any = document.querySelector('gcl-data-grid');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\" key=\"Sarah\"></gcl-data-row><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></gcl-data-row><!--_$em_-->");

        component.data = [
            {
                name: "Mark",
                age: 31,
                description: 'Hard worker'
            },
            {
                name: "Sarah",
                age: 19,
                description: 'Smart and beautiful'
            }
        ];

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></gcl-data-row><gcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\" key=\"Sarah\"></gcl-data-row><!--_$em_-->");
    });
});