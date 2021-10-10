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
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');

        component.type = 'b';

        expect(component.type).toBe('b');
    });

    it('should populate the state of the custom element with default values including the ones from the base element', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get state() {

                return {

                    state1: {
                        value: "a" // Options: "a" | "b" | "c"
                    }
                };
            } 
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static get state() {

                return {

                    state2: {
                        value: "b" // Options: "a" | "b" | "c"
                    }
                };
            } 
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a><test-b></test-b>';

        // Test the elements
        const componentA: any = document.querySelector('test-a');

        expect(componentA.state1).toBe('a');

        componentA.state1 = 'b'; // It should change the state1

        expect(componentA.state1).toBe('b');

        const componentB: any = document.querySelector('test-b');

        expect(componentB.state1).toBe('a');

        componentB.state1 = 'b'; // It should change the state1

        expect(componentB.state1).toBe('b');

        expect(componentB.state2).toBe('b');

        componentB.state2 = 'c'; // It should change the state2

        expect(componentB.state2).toBe('c');
    });

});