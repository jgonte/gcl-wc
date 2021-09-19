import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";
import html from "../../virtual-dom/html";
import css from "../helpers/css";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element parent children relationship tests", () => {

    it('should set the children of the parent', async () => {

        const callTester = {

            didMountCallback: (element) => { }
        };

        //@ts-ignore
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

                callTester.didMountCallback(this);
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

                callTester.didMountCallback(this);
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

        await childComponent.updateComplete; // Wait for the component to render

        expect(parentComponent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parentComponent.adoptedChildren)[0]).toBe(childComponent);

        expect(spyMountedCallback).toHaveBeenCalledTimes(2);

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, childComponent); // Children should be called first

        expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parentComponent);
    });

});
