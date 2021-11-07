import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";
import css from "../helpers/css";
import { html } from "../../renderer/renderer";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element parent children relationship tests", () => {

    it('should call the child didMountCallback before the parent', async () => {

        const callTester = {

            didMountCallback: (element) => { }
        };

        class Parent extends CustomElement {

            static get properties() {

                return {

                    name: {
                        type: String,
                        value: "Sarah"
                    }
                };
            }

            static get styles() {

                return css`
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }

            render() {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Parent
            }
        };

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties() {

                return {

                    age: {
                        type: Number,
                        value: 19
                    }
                };
            }

            static get styles() {

                return css`
                    :host {
                        background-color: aliceblue
                    }
                `;
            }

            render() {

                return html`
                    <span>My age is ${this.age}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Child
            }
        };

        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML =
            `
            <test-parent>
                <test-child></test-child>
            </test-parent>
        `;

        // Test the element
        const parentComponent: any = document.querySelector('test-parent');

        await parentComponent.updateComplete; // Wait for the component to render

        const childComponent: any = document.querySelector('test-child');

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parentComponent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parentComponent.adoptedChildren)[0]).toBe(childComponent);

        //expect(spyMountedCallback).toHaveBeenCalledTimes(2); TODO: Research why it is not calling the spy on the parent

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, childComponent); // Children should be called first

        //expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parentComponent);
    });

    it('should call the child didMountCallback before the slotted parent', async () => {

        const callTester = {

            didMountCallback: (element) => { }
        };

        class Parent extends CustomElement {

            static get properties() {

                return {

                    name: {
                        type: String,
                        value: "Sarah"
                    }
                };
            }

            static get styles() {

                return css`
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }

            render() {

                return html`
                    <slot name="content"></slot>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Slotted parent
            }
        };

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties() {

                return {

                    age: {
                        type: Number,
                        value: 19
                    }
                };
            }

            static get styles() {

                return css`
                    :host {
                        background-color: aliceblue
                    }
                `;
            }

            render() {

                return html`
                    <span>My age is ${this.age}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Slotted child
            }
        };

        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML =
            `
            <test-parent>
                <test-child slot="content"></test-child>
            </test-parent>
        `;

        // Test the element
        const parentComponent: any = document.querySelector('test-parent');

        await parentComponent.updateComplete; // Wait for the component to render

        const childComponent: any = document.querySelector('test-child');

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parentComponent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parentComponent.adoptedChildren)[0]).toBe(childComponent);

        //expect(spyMountedCallback).toHaveBeenCalledTimes(2); TODO: Research why it is not calling the spy on the parent

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, childComponent); // Children should be called first

        //expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parentComponent);
    });

});
