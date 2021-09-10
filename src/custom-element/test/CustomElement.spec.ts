import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";

beforeEach(() => {
    
    clearCustomElements();
});

describe("custom element tests", () => {

    it('should populate the properties of the custom element with default values', () => {

        //@ts-ignore
        class B extends CustomElement {

            static properties = {

                type: {
                    type: String,
                    value: "a" // Options: "a" | "b" | "c"
                },

                fcn: {
                    type: Function,
                    value: (element: B, text: string) => {
                        return `${text} ${element.type}`;
                    } 
                }
            };
        };

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-b></test-b>';

        document.body.appendChild(root);

        // Test the element
        const component : any = document.querySelector('test-b');

        expect(component.type).toBe('a');

        component.type = 'b'; // It should change the type

        const fcn = component.fcn;

        const text = fcn(component, 'This is the type:');

        expect(text).toEqual('This is the type: b');
    });
});
