import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";
import { NodePatchingData } from "../../renderer/NodePatcher";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element shadow root tests", () => {

    it('should create a shadow root by default', () => {

        class A extends CustomElement {

            render() : NodePatchingData {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.shadowRoot).not.toBeNull();
    });

    it('should not create a shadow root when the shadow configuration property is set to false', () => {

        class A extends CustomElement {

            static get component() {

                return {

                    shadow: false
                };              
            }

            render() : NodePatchingData {

                return null;
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
