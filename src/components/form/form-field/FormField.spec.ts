import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import clearCustomElements from "../../../custom-element/test/utils/clearCustomElements";
import TextField from "../../fields/text/TextField";
import FormField from "./FormField";

beforeEach(() => {

    clearCustomElements();
});

describe("form tests", () => {

    it('should render a form field', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('gcl-text-field', TextField);

        defineCustomElement('gcl-form-field', FormField);

        // Attach it to the DOM
        document.body.innerHTML = `<gcl-form-field>
            <span slot="label">Name</span>
            <gcl-text-field slot="field" name="name"></gcl-text-field>
        </gcl-form-field>`;

        // Test the element
        const component: any = document.querySelector('gcl-form-field');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(
`<style>[object Object]

[object Object]</style><gcl-row id="field-row" justify-content=\"start\">
            <gcl-form-label>
                <slot name="label">Label</slot>
            </gcl-form-label>
            <slot name="tools"></slot>
            :
            <span style="display:inline-block; padding: 0 1rem 0 0;"></span>
            <slot name=\"field\"></slot>
        </gcl-row>
        <gcl-validation-summary warnings=\"[]\" errors=\"[]\"></gcl-validation-summary>`
        );
    });
});