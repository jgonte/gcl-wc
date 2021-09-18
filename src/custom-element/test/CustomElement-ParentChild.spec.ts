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
        };

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML = 
        `
            <test-parent>
                <test-child></test-child>
            </test-parent>
        `;

        // Test the element
        const component: any = document.querySelector('test-parent');

        await component.updateComplete; // Wait for the component to render

        expect(component.adoptedChildren.size).toBe(1);
    });

});
