import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element tests", () => {

    it('should set the default property value', () => {

        //@ts-ignore
        class A extends CustomElement {

            static get properties() {

                return {

                    type: {
                        type: String,
                        value: "a" // Options: "a" | "b" | "c",
                    }
                };
            }
        };

        defineCustomElement('test-a', A);

        (window as any).displayType = (element: A, text: string) => `Overriden ${text} ${(element as any).type}`;

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');

    });

    it('should set the default state value', () => {

        //@ts-ignore
        class A extends CustomElement {

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
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');
    });
});
