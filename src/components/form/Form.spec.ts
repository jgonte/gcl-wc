import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../custom-element/test/utils/clearCustomElements";
import TextField from "../fields/text/TextField";
import FormField from "./form-field/FormField";
import Form from "./Form";

beforeEach(() => {

    clearCustomElements();
});

describe("form tests", () => {

    it('should throw an error when the submit url is not provided', () => {

        // Re-register the form and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('gcl-form', Form);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-form></gcl-form>`;

        }).toThrow(new Error("The attributes: [submit-url] must have a value"));
    });

    it('should render a form', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('gcl-text-field', TextField);

        defineCustomElement('gcl-form-field', FormField);

        defineCustomElement('gcl-form', Form);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcl-form submit-url="http://localhost:60314/api/contacts/">
            <gcl-form-field>
                <span slot="label">Name</span>
                <gcl-text-field slot="field" id="tf2" name="name" value="Sarah"></gcl-text-field>
            </gcl-form-field>
        </gcl-form>`;

        // Test the element
        const component: any = document.querySelector('gcl-form');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`          <!--_$node_--><form key=\"form\"><slot key=\"form-fields-slot\"></slot><gcl-button key=\"submit-button\">\n            Submit</gcl-button><!--_$node_--></form>`);
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

    //     // Re-register the form since all the custom elements are cleared before any test
    //     defineCustomElement('gcl-data-cell', DataCell);

    //     defineCustomElement('gcl-data-row', DataRow);

    //     defineCustomElement('gcl-data-grid', DataGrid);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<gcl-data-grid id="dg2" data="getData()" fields="getFields()"></gcl-data-grid>';

    //     // Test the element
    //     const component: any = document.querySelector('gcl-data-grid');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe(`<gcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></gcl-data-header><!----><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"tbd\"></gcl-data-row><!----><gcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"tbd\"></gcl-data-row><!----><style>[object Object]</style>`);
    // });
});