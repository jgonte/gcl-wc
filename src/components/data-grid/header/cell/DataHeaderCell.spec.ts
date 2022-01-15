import defineCustomElement from "../../../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../../../custom-element/test/utils/clearCustomElements";
import DataHeaderCell from "./DataHeaderCell";

beforeEach(() => {

    clearCustomElements();
});

describe("Data cell tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-header-cell', DataHeaderCell);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-header-cell></gcl-data-header-cell>`;

        }).toThrow(new Error("The attributes: [field] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-header-cell', DataHeaderCell);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-header-cell id="dc1" field="name"></gcl-data-header-cell>';

        // Test the element
        const component: any = document.querySelector('gcl-data-header-cell');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_-->name<!--_$em_-->");
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as any).getField = function () {

            return "name";
        };

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-header-cell', DataHeaderCell);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-header-cell id="dc2" field="getField()"></gcl-data-header-cell>';

        // Test the element
        const component: any = document.querySelector('gcl-data-header-cell');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_-->name<!--_$em_-->");
    });
});