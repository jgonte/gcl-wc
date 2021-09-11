import clearCustomElements from "../utils/clearCustomElements";
import defineCustomElement from "../../helpers/defineCustomElement";
import MetadataInitializerMixin from "../../mixins/MetadataInitializerMixin";

beforeEach(() => {

    clearCustomElements();
});

describe("MetadataInitializerMixin tests of the functionality of the state properties", () => {

    it('should populate the state of the custom element with default values', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get state() {

                return {

                    type: {
                        value: "a" // Options: "a" | "b" | "c"
                    }
                };
            } 
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-a></test-a>';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');

        component.type = 'b';

        expect(component.type).toBe('b');
    });

});