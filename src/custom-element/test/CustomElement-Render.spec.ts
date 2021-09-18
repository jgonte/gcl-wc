import clearCustomElements from "./utils/clearCustomElements";
import CustomElement from "../CustomElement";
import defineCustomElement from "../helpers/defineCustomElement";
import html from "../../virtual-dom/html";
import css from "../helpers/css";

beforeEach(() => {

    clearCustomElements();
});

describe("custom element render tests", () => {

    it('should render the HTML with the default property', async () => {

        //@ts-ignore
        class A extends CustomElement {

            static get properties() {

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

        expect(component.shadowRoot.innerHTML).toBe('<span>Hello, my name is Sarah</span>');
    });

    it('should render the HTML with the set property', async () => {

        //@ts-ignore
        class A extends CustomElement {

            static get properties() {

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

        expect(component.shadowRoot.innerHTML).toBe('<span>Hello, my name is Mark</span>');
    });

    it('should render the HTML with the default property and the style attached', async () => {

        //@ts-ignore
        class A extends CustomElement {

            static get properties() {

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

        expect(component.shadowRoot.innerHTML).toBe('<span>Hello, my name is Sarah</span><span>My age is 19</span><style>:host{background-color:yellowgreen;}</style>');
    });

    it('should render the HTML with the set property and the style attached', async () => {

        //@ts-ignore
        class A extends CustomElement {

            static get properties() {

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

        expect(component.shadowRoot.innerHTML).toBe('<span>Hello, my name is Mark</span><span>My age is 31</span><style>:host{background-color:yellowgreen;}</style>');
    });
    
});
