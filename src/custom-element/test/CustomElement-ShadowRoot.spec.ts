import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element shadow root tests", () => {

    it('should create a shadow root by default', () => {

        //@ts-ignore
        class A extends CustomElement {}

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.shadowRoot).not.toBeNull();
    });

    it('should not create a shadow root when the shadow configuration property is set to false', () => {

        //@ts-ignore
        class A extends CustomElement {

            static get component() {

                return {

                    shadow: false
                };
                
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.shadowRoot).toBeNull();
    });

});
