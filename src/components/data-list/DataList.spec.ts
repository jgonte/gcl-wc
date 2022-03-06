import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import DataList from "./DataList";

beforeEach(() => {

    clearCustomElements();
});

describe("Data list tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data list and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-list', DataList);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-list></gcl-data-list>`;

        }).toThrow(new Error("The attributes: [id-field] must have a value"));
    });

    it('should render the data', async () => {

        // Re-register the data list since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-list', DataList);

        //     // Set up the functions to be called
        (window as any).getData = function () {

            return [
                {
                    code: 1,
                    description: "Item 1"
                }
            ];
        };

        const idField = "code";

        const displayField = "description"

        // Attach it to the DOM
        document.body.innerHTML = `<gcl-data-list data="getData()" id-field=${idField} display-field=${displayField} selectable="false"></gcl-data-list>`;

        // Test the element
        const component: any = document.querySelector('gcl-data-list');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<ul><!--_$bm_--><li key=\"1\" style=\"\n    list-style-type: none;\n\">\n                <gcl-selectable selectable=\"false\" select-value=\"{&#x22;code&#x22;:1,&#x22;description&#x22;:&#x22;Item 1&#x22;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n            </li><!--_$em_--></ul>");

        // Add another item
        component.data = [
            {
                code: 1,
                description: "Item 1"
            },
            {
                code: 2,
                description: "Item 2"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<ul><!--_$bm_--><li key=\"1\" style=\"\n    list-style-type: none;\n\">\n                <gcl-selectable selectable=\"false\" select-value=\"{&#x22;code&#x22;:1,&#x22;description&#x22;:&#x22;Item 1&#x22;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n            </li><li key=\"2\" style=\"\n    list-style-type: none;\n\">\n                <gcl-selectable selectable=\"false\" select-value=\"{&#x22;code&#x22;:2,&#x22;description&#x22;:&#x22;Item 2&#x22;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n            </li><!--_$em_--></ul>");

        // Remove the first item
        component.data = [
            {
                code: 2,
                description: "Item 2"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<ul><!--_$bm_--><li key=\"1\" style=\"\n    list-style-type: none;\n\">\n                <gcl-selectable selectable=\"false\" select-value=\"{&#x22;code&#x22;:1,&#x22;description&#x22;:&#x22;Item 1&#x22;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n            </li><li key=\"2\" style=\"\n    list-style-type: none;\n\">\n                <gcl-selectable selectable=\"false\" select-value=\"{&#x22;code&#x22;:2,&#x22;description&#x22;:&#x22;Item 2&#x22;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n            </li><!--_$em_--></ul>");
    });

    // it('should render when the data of the attributes is provided via functions', async () => {

    //     // Set up the functions to be called
    //     (window as any).getData = function () {

    //         return [
    //             {
    //                 name: "Sarah",
    //                 age: 19,
    //                 description: 'Smart and beautiful'
    //             },
    //             {
    //                 name: "Mark",
    //                 age: 31,
    //                 description: 'Hard worker'
    //             }
    //         ];
    //     };

    //     (window as any).getFields = function () {

    //         return ["name", "age", "description"];
    //     };

    //     // Re-register the data list since all the custom elements are cleared before any test
    //     defineCustomElement('gcl-data-list', DataList);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<gcl-data-list id="dg2" id-field="name" data="getData()" fields="getFields()"></gcl-data-list>';

    //     // Test the element
    //     const component: any = document.querySelector('gcl-data-list');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"Sarah\"></gcl-data-row><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"Mark\"></gcl-data-row><!--_$em_-->");
    // });

    // it('should swap the records', async () => {

    //     // Set up the functions to be called
    //     (window as any).getData = function () {

    //         return [
    //             {
    //                 name: "Sarah",
    //                 age: 19,
    //                 description: 'Smart and beautiful'
    //             },
    //             {
    //                 name: "Mark",
    //                 age: 31,
    //                 description: 'Hard worker'
    //             }
    //         ];
    //     };

    //     (window as any).getFields = function () {

    //         return ["name", "age", "description"];
    //     };

    //     // Re-register the data list since all the custom elements are cleared before any test
    //     defineCustomElement('gcl-data-list', DataList);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<gcl-data-list id="dg2"  id-field="name" data="getData()" fields="getFields()"></gcl-data-list>';

    //     // Test the element
    //     const component: any = document.querySelector('gcl-data-list');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"Sarah\"></gcl-data-row><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"Mark\"></gcl-data-row><!--_$em_-->");

    //     component.data = [
    //         {
    //             name: "Mark",
    //             age: 31,
    //             description: 'Hard worker'
    //         },
    //         {
    //             name: "Sarah",
    //             age: 19,
    //             description: 'Smart and beautiful'
    //         }
    //     ];

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><gcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcl-data-header><!--_$em_--><!--_$bm_--><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"Mark\"></gcl-data-row><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"Sarah\"></gcl-data-row><!--_$em_-->");
    // });
});