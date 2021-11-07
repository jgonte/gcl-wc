import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../../custom-element/test/utils/clearCustomElements";
import DataHeaderCell from "./cell/DataHeaderCell";
import DataHeader from "./DataHeader";

beforeEach(() => {

    clearCustomElements();
});

describe("Data row tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data row and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-header-cell', DataHeaderCell);

        defineCustomElement('gcl-data-header', DataHeader);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-data-header></gcl-data-header>`;

        }).toThrow(new Error("The attributes: [fields] must have a value"));
    });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data row since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-header-cell', DataHeaderCell);

        defineCustomElement('gcl-data-header', DataHeader);

        // Attach it to the DOM
        document.body.innerHTML = `
        <gcl-data-header id="dr1" 
            fields='[ "name", "age", "description" ]'
        >
        </gcl-data-header>`;

        // Test the element
        const component: any = document.querySelector('gcl-data-header');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<style>[object Object]</style><gcl-data-header-cell field=\"name\" key=\"name\"></gcl-data-header-cell><gcl-data-header-cell field=\"age\" key=\"age\"></gcl-data-header-cell><gcl-data-header-cell field=\"description\" key=\"description\"></gcl-data-header-cell>`);
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as any).getFields = function () {

            return ["name", "age", "description"];
        };

        // Re-register the data row since all the custom elements are cleared before any test
        defineCustomElement('gcl-data-header-cell', DataHeaderCell);
        
        defineCustomElement('gcl-data-header', DataHeader);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-data-header id="dr2" fields="getFields()"></gcl-data-header>';

        // Test the element
        const component: any = document.querySelector('gcl-data-header');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(`<style>[object Object]</style><gcl-data-header-cell field=\"name\" key=\"name\"></gcl-data-header-cell><gcl-data-header-cell field=\"age\" key=\"age\"></gcl-data-header-cell><gcl-data-header-cell field=\"description\" key=\"description\"></gcl-data-header-cell>`);
    });
});