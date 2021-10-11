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

        const spySetState = jest.spyOn(component, 'setState');

        component.type = 'b';

        expect(spySetState).toHaveBeenCalledWith('type', 'b');

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

        const spySetStateA = jest.spyOn(componentA, 'setState');

        componentA.state1 = 'b'; // It should change the state1

        expect(spySetStateA).toHaveBeenCalledWith('state1', 'b');

        expect(componentA.state1).toBe('b');

        const componentB: any = document.querySelector('test-b');

        expect(componentB.state1).toBe('a');

        const spySetStateB = jest.spyOn(componentB, 'setState');

        componentB.state1 = 'b'; // It should change the state1

        expect(spySetStateB).toHaveBeenCalledWith('state1', 'b');

        expect(componentB.state1).toBe('b');

        expect(componentB.state2).toBe('b');

        componentB.state2 = 'c'; // It should change the state2

        expect(spySetStateB).toHaveBeenCalledWith('state2', 'c');

        expect(componentB.state2).toBe('c');
    });

    it('should populate the state of the custom element with default values including the ones from the mixins', () => {

        const State1Mixin = Base =>
            class State1 extends Base {

                static get state() {

                    return {

                        state1: {
                            value: "a"
                        }
                    };
                }
            }

        const State2Mixin = Base =>
            class State2 extends Base {

                static get state() {

                    return {

                        state2: {
                            value: "b"
                        }
                    };
                }
            }

        //@ts-ignore
        class A extends
            State2Mixin(
                State1Mixin(
                    MetadataInitializerMixin(HTMLElement)
                )
            )
        {
            static get state() {

                return {

                    state3: {
                        value: "c"
                    }
                };
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the elements
        const componentA: any = document.querySelector('test-a');

        expect(componentA.state1).toBe('a');

        expect(componentA.state2).toBe('b');

        expect(componentA.state3).toBe('c');

        const spySetState = jest.spyOn(componentA, 'setState');

        componentA.state1 = '1'; // It should change the state1

        expect(spySetState).toHaveBeenCalledWith('state1', '1');

        expect(componentA.state1).toBe('1');

        componentA.state2 = '2'; // It should change the state2

        expect(spySetState).toHaveBeenCalledWith('state2', '2');

        expect(componentA.state2).toBe('2');

        componentA.state3 = '3'; // It should change the state3

        expect(spySetState).toHaveBeenCalledWith('state3', '3');

        expect(componentA.state3).toBe('3');
    });
});