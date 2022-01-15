import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";
import css from "../helpers/css";
import { html } from "../../renderer/html";
import { CustomElementPropertyMetadata } from "../interfaces";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element render tests", () => {

    it('should render the element even when there are no properties changing', async () => {

        class A extends CustomElement {

            render() {

                return html`
                    <span>Hello, my name is unknown</span>
                `;
            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML.trim()).toBe('<span>Hello, my name is unknown</span>');
    });

    it('should render the HTML with the default property', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: String,
                        value: "Sarah"
                    }
                };
            }

            render() {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML.trim()).toBe('<span>Hello, my name is <!--_$bm_-->Sarah<!--_$em_--></span>');
    });

    it('should render the HTML with the set property', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: String,
                        value: "Sarah"
                    }
                };
            }

            render() {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a name="Mark"></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML.trim()).toBe('<span>Hello, my name is <!--_$bm_-->Mark<!--_$em_--></span>');
    });

    it('should render the HTML with the default property and the style attached', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: String,
                        value: "Sarah"
                    },

                    age: {
                        type: Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return css`:host { background-color: yellowgreen; }`;
            }

            render() {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                    <span>My age is ${this.age}</span>
                `;
            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>:host { background-color: yellowgreen; }</style>\n                    <span>Hello, my name is <!--_$bm_-->Sarah<!--_$em_--></span>\n                    <span>My age is <!--_$bm_-->19<!--_$em_--></span>\n                ");
    });

    it('should render the HTML with the set property and the style attached', async () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: String,
                        value: "Sarah"
                    },

                    age: {
                        type: Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return css`:host { background-color: yellowgreen; }`;
            }

            render() {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                    <span>My age is ${this.age}</span>
                `;
            }
        };

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a name="Mark" age="31"></test-a>"';

        // Test the element
        const component: any = document.querySelector('test-a');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe("<style>:host { background-color: yellowgreen; }</style>\n                    <span>Hello, my name is <!--_$bm_-->Mark<!--_$em_--></span>\n                    <span>My age is <!--_$bm_-->31<!--_$em_--></span>\n                ");
    });

});
