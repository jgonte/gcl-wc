import clearCustomElements from "../utils/clearCustomElements";
import defineCustomElement from "../../helpers/defineCustomElement";
import MetadataInitializerMixin from "../../mixins/core/MetadataInitializerMixin";

beforeEach(() => {

    clearCustomElements();
});

describe("MetadataInitializerMixin tests of the functionality of the properties", () => {

    it('should populate the properties of the custom element with default values', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get properties() {

                return {

                    type: {
                        type: String,
                        value: "a" // Options: "a" | "b" | "c"
                    },

                    showType: {
                        type: Function,
                        value: function () {
                            return `This is the type: ${this.type}`;
                        }
                    },

                    smart: {
                        type: Boolean,
                        value: false
                    },

                    record: {
                        type: [Object, Function],
                        value: {
                            name: 'Sarah'
                        }
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

        component.type = 'b'; // It should change the type

        expect(component.showType).toEqual('This is the type: b');

        expect(component.smart).toBe(false);

        expect(component.record).toStrictEqual({
            name: 'Sarah'
        });
    });

    it('should populate the properties of the custom element with default values including the ones from the base element', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get properties() {

                return {

                    type: {
                        type: String,
                        value: "a" // Options: "a" | "b" | "c"
                    }
                };
            }
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static get properties() {

                return {

                    showType: {
                        type: Function,
                        value: function () {
                            return `This is the type: ${this.type}`;
                        }
                    },
                };
            }
        }

        defineCustomElement('test-b', B);

        expect((B as any).properties).not.toBe((A as any).properties); // Verify the property configurators are not shared

        expect((B as any).state).toBe((A as any).state); // Both the state configurators are undefined

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-a></test-a><test-b></test-b>';

        document.body.appendChild(root);

        // Test the elements
        const componentA: any = document.querySelector('test-a');

        expect(componentA.type).toBe('a');

        componentA.type = 'b'; // It should change the type

        expect(componentA.type).toBe('b');

        expect(componentA.fcn).not.toBeDefined();

        const componentB: any = document.querySelector('test-b');

        expect(componentB.type).toBe('a');

        componentB.type = 'b'; // It should change the type

        expect(componentB.showType).toEqual('This is the type: b');
    });

    it('should override the properties of the custom element when the attributes are provided', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get properties() {

                return {

                    type: {
                        type: String,
                        value: "a", // Options: "a" | "b" | "c"
                        change: function() {

                            this.refreshType(this.type);
                        }                            
                    },

                    showType: {
                        type: Function,
                        value: function () {
                            return `This is the type: ${this.type}`;
                        }
                    },

                    smart: {
                        type: Boolean
                    }
                };
            }

            refreshType(type: string) {

            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        const root = document.createElement('div');

        (window as any).displayType = (element: A, text: string) => `Overriden ${text} ${(element as any).type}`;

        root.innerHTML = '<test-a type="c" fcn="displayType()" smart></test-a>"';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('c');

        expect(component.showType).toEqual('This is the type: c');

        expect(component.smart).toBe(true);
    });

    it('should override the properties of the custom element when the attributes are provided including the base elements', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get properties() {

                return {

                    type: {
                        type: String,
                        value: "a", // Options: "a" | "b" | "c"
                        afterUpdate: function() {

                            this.refreshType(this.type);
                        }
                    }
                };
            }

            refreshType(type: string) {

            }
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static get properties() {

                return {

                    showType: {
                        type: Function,
                        value: function () {
                            return `This is the type: ${this.type}`;
                        }
                    }
                };
            }
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        const root = document.createElement('div');

        (window as any).displayType = (element: A, text: string) => `Overriden ${text} ${(element as any).type}`;

        root.innerHTML = '<test-a type="b"></test-a><test-b type="c" fcn="displayType()"></test-b>';

        document.body.appendChild(root);

        // Test the elements
        const componentA: any = document.querySelector('test-a');

        expect(componentA.type).toBe('b');

        const spySetPropertyA = jest.spyOn(componentA, 'setProperty');

        componentA.type = 'c'; // It should change the type

        expect(spySetPropertyA).toHaveBeenCalledWith('type', 'c');

        expect(componentA.type).toBe('c');

        expect(componentA.fcn).not.toBeDefined();

        const componentB: any = document.querySelector('test-b');

        expect(componentB.type).toBe('c');

        expect(componentB.showType).toEqual('This is the type: c');
    });

    it('should populate the properties of the custom element with default values including the ones from the mixins', () => {

        const Property1Mixin = Base =>
            class Property1 extends Base {

                static get properties() {

                    return {

                        prop1: {
                            value: "a"
                        }
                    };
                }
            }

        const Property2Mixin = Base =>
            class Property2 extends Base {

                static get properties() {

                    return {

                        prop2: {
                            value: "b"
                        }
                    };
                }
            }

        //@ts-ignore
        class A extends
            Property2Mixin(
                Property1Mixin(
                    MetadataInitializerMixin(HTMLElement)
                )
            )
        {
            static get properties() {

                return {

                    prop3: {
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

        expect(componentA.prop1).toBe('a');

        expect(componentA.prop2).toBe('b');

        expect(componentA.prop3).toBe('c');

        const spySetProperty = jest.spyOn(componentA, 'setProperty');

        componentA.prop1 = '1'; // It should change the prop1

        expect(spySetProperty).toHaveBeenCalledWith('prop1', '1');

        expect(componentA.prop1).toBe('1');

        componentA.prop2 = '2'; // It should change the prop2

        expect(spySetProperty).toHaveBeenCalledWith('prop2', '2');

        expect(componentA.prop2).toBe('2');

        componentA.prop3 = '3'; // It should change the prop3

        expect(spySetProperty).toHaveBeenCalledWith('prop3', '3');

        expect(componentA.prop3).toBe('3');
    });

    // it('should set the attribute (reflect) when the property has changed', () => {

    //     //@ts-ignore
    //     class A extends MetadataInitializerMixin(HTMLElement) {

    //         static properties = {

    //             name: {
    //                 type: String,
    //                 value: "Sarah",
    //                 reflect: true // When updated internally reflect (synchronize) with the attribute
    //             }
    //         };
    //     };

    //     defineCustomElement('test-a', A);

    //     // Attach it to the DOM
    //     const root = document.createElement('div');

    //     root.innerHTML = '<test-a></test-a>';

    //     document.body.appendChild(root);

    //     // Test the element
    //     const component: any = document.querySelector('test-a');

    //     expect(component.name).toBe('Sarah');

    //     expect(component.getAttribute('name')).toEqual('Sarah');

    //     const spyAttributeChangedCallback = jest.spyOn(component, 'attributeChangedCallback');

    //     //attributeChangedCallback(attributeName: string, oldValue, newValue)

    //     component.name = 'Mark';

    //     expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(1);

    //     expect(spyAttributeChangedCallback).toHaveBeenCalledWith("name", "Sarah", "Mark");

    //     expect(component.getAttribute('name')).toEqual('Mark');
    // });

    // it('should throw an error if the property is required and no value was provided', () => {

    //     //@ts-ignore
    //     class A extends MetadataInitializerMixin(HTMLElement) {

    //         static properties = {

    //             name: {
    //                 type: String,
    //                 //value: "Sarah", // No value provided
    //                 required: true // Must have a value
    //             }
    //         };
    //     };

    //     defineCustomElement('test-a', A);

    //     // Attach it to the DOM
    //     const root = document.createElement('div');

    //     root.innerHTML = '<test-a></test-a>';

    //     expect(() => {

    //         document.body.appendChild(root);

    //     }).toThrow(new Error('The attributes: [name] must have a value'));
    // });

    // it('should throw an error if an attribute is being set but its value does not correspond to a configured property', () => {

    //     //@ts-ignore
    //     class A extends MetadataInitializerMixin(HTMLElement) {

    //         static properties = {

    //             name: {
    //                 type: String,
    //                 //value: "Sarah", // No value provided
    //                 //required: true // Must have a value
    //             }
    //         };
    //     };

    //     defineCustomElement('test-a', A);

    //     // Attach it to the DOM
    //     const root = document.createElement('div');

    //     root.innerHTML = '<test-a></test-a>';

    //     document.body.appendChild(root);

    //     // Test the element
    //     const component: any = document.querySelector('test-a');

    //     expect(() => {

    //         component.setAttribute('type', 'a');

    //     }).toThrow(new Error("There is no configured property for attribute: 'type' in type: 'A'"));
    // });

    // it('should not throw an error if an attribute is being set and it is not a configured property but it is an HTMLElement one', () => {

    //     //@ts-ignore
    //     class A extends MetadataInitializerMixin(HTMLElement) {

    //         static properties = {

    //             name: {
    //                 type: String,
    //                 //value: "Sarah", // No value provided
    //                 //required: true // Must have a value
    //             }
    //         };
    //     };

    //     defineCustomElement('test-a', A);

    //     // Attach it to the DOM
    //     const root = document.createElement('div');

    //     root.innerHTML = '<test-a id="test-component-1"></test-a>';

    //     document.body.appendChild(root);

    //     // Test the element
    //     const component: any = document.querySelector('test-a');

    //     expect(component.id).toEqual('test-component-1');

    //     component.setAttribute('id', 'test-component-2');

    //     // expect(() => {

    //     //     component.setAttribute('type', 'a');

    //     // }).toThrow(new Error("There is no configured property for attribute: 'type' in type: 'A'"));
    // });

});
