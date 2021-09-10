import clearCustomElements from "../utils/clearCustomElements";
import defineCustomElement from "../../helpers/defineCustomElement";
import MetadataInitializerMixin from "../../mixins/MetadataInitializerMixin";
import oneOf from "../../helpers/oneOf";

beforeEach(() => {

    clearCustomElements();
});

describe("MetadataInitializerMixin tests of the functionality of the properties", () => {

    it('should populate the properties of the custom element with default values', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static properties = {

                type: {
                    type: String,
                    value: "a" // Options: "a" | "b" | "c"
                },

                fcn: {
                    type: Function,
                    value: (element: A, text: string) => {
                        return `${text} ${element.type}`;
                    }
                },

                smart: {
                    type: Boolean,
                    value: false
                },

                record: {
                    type: oneOf(Object, Function),
                    value: {
                        name: 'Sarah'
                    }
                },
            };
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-a></test-a>';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.type).toBe('a');

        component.type = 'b'; // It should change the type

        const fcn = component.fcn;

        const text = fcn(component, 'This is the type:');

        expect(text).toEqual('This is the type: b');

        expect(component.smart).toBe(false);

        expect(component.record).toStrictEqual({
            name: 'Sarah'
        });
    });

    it('should populate the properties of the custom element with default values including the ones from the base element', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static properties = {

                type: {
                    type: String,
                    value: "a" // Options: "a" | "b" | "c"
                }
            };
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static properties = {

                fcn: {
                    type: Function,
                    value: (element: B, text: string) => {
                        return `${text} ${element.type}`;
                    }
                }
            };
        }

        defineCustomElement('test-b', B);

        expect((B as any).properties).not.toBe((A as any).properties); // Verify the property configurators are not shared

        //expect((B as any).state).not.toBe((A as any).state); // Verify the state configurators are not shared

        expect((B as any).metadata).not.toBe((A as any).metadata); // Verify the metadata is not shared

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-b></test-b>';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-b');

        expect(component.type).toBe('a');

        component.type = 'b'; // It should change the type

        const fcn = component.fcn;

        const text = fcn(component, 'This is the type:');

        expect(text).toEqual('This is the type: b');
    });

    it('should override the properties of the custom element when the attributes are provided', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static properties = {

                type: {
                    type: String,
                    value: "a" // Options: "a" | "b" | "c"
                },

                fcn: {
                    type: Function,
                    value: (element: A, text: string) => {
                        return `${text} ${element.type}`;
                    }
                },

                smart: {
                    type: Boolean
                }
            };
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

        const fcn = component.fcn;

        const text = fcn(component, 'This is the type:');

        expect(text).toEqual('Overriden This is the type: c');

        expect(component.smart).toBe(true);
    });

    it('should override the properties of the custom element when the attributes are provided including the base elements', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static properties = {

                type: {
                    type: String,
                    value: "a" // Options: "a" | "b" | "c"
                }
            };
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static properties = {

                fcn: {
                    type: Function,
                    value: (element: A, text: string) => {
                        return `${text} ${element.type}`;
                    }
                }
            };
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        const root = document.createElement('div');

        (window as any).displayType = (element: A, text: string) => `Overriden ${text} ${(element as any).type}`;

        root.innerHTML = '<test-b type="c" fcn="displayType()"></test-b>';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-b');

        expect(component.type).toBe('c');

        const fcn = component.fcn;

        const text = fcn(component, 'This is the type:');

        expect(text).toEqual('Overriden This is the type: c');
    });

    it('should set the attribute (reflect) when the property has changed', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static properties = {

                name: {
                    type: String,
                    value: "Sarah",
                    reflect: true // When updated internally reflect (synchronize) with the attribute
                }
            };
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-a></test-a>';

        document.body.appendChild(root);

        // Test the element
        const component: any = document.querySelector('test-a');

        expect(component.name).toBe('Sarah');

        expect(component.getAttribute('name')).toEqual('Sarah');

        const spyAttributeChangedCallback = jest.spyOn(component, 'attributeChangedCallback');

        //attributeChangedCallback(attributeName: string, oldValue, newValue)

        component.name = 'Mark';

        expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(1);

        expect(spyAttributeChangedCallback).toHaveBeenCalledWith("name", "Sarah", "Mark");

        expect(component.getAttribute('name')).toEqual('Mark');
    });

    it('should throw an error if the property is required and no value was provided', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static properties = {

                name: {
                    type: String,
                    //value: "Sarah", // No value provided
                    required: true // Must have a value
                }
            };
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        const root = document.createElement('div');

        root.innerHTML = '<test-a></test-a>';

        expect(() => {
            
            document.body.appendChild(root);

        }).toThrow(new Error('The attributes: [name] must have a value'));
    });

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
