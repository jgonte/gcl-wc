import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";

beforeEach(() => {
    
    clearCustomElements();
});

describe("custom element tests", () => {

    it('should call update when a property changes', () => {

        //@ts-ignore
        class A extends CustomElement {

            static get properties() {

                return {

                    type: {
                        type: String,
                        value: "a" // Options: "a" | "b" | "c"
                    }
                };
            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        const root = document.createElement('div');

        (window as any).displayType = (element: A, text: string) => `Overriden ${text} ${(element as any).type}`;

        root.innerHTML = '<test-a></test-a>"';

        document.body.appendChild(root);

        // // Test the element
         const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');

    });

    it('should call update when the state changes', () => {

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
        const root = document.createElement('div');

        root.innerHTML = '<test-a></test-a>';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');
    });
});
