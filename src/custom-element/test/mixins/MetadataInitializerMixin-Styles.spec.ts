import clearCustomElements from "../utils/clearCustomElements";
import defineCustomElement from "../../helpers/defineCustomElement";
import MetadataInitializerMixin from "../../mixins/core/MetadataInitializerMixin";
import css from "../../helpers/css";

beforeEach(() => {

    clearCustomElements();
});

describe("MetadataInitializerMixin tests of the functionality of the styles", () => {

    it('should populate a single style of the custom element', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get styles(): string {

                return css`div { color: red; }`;
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.styles).toEqual("div { color: red; }");
    });

    it('should populate a several styles of the custom element', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get styles(): string {

                return [
                    css`div { color: red; }`,
                    css`span { display: inline-block; }`,
                ].join('');
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.styles).toEqual('div { color: red; }span { display: inline-block; }');
    });

    it('should not inherit the styles of the base custom element by default', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get styles(): string {

                return css`div { color: red; }`;
            }
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static get styles(): string {

                return css`span { display: inline-block; }`;

            }
        }

        defineCustomElement('test-b', B);

        expect(B.metadata.styles).toEqual("span { display: inline-block; }");

    });

    it('should allow to include the styles of the base custom element', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get styles(): string {

                return css`div { color: red; }`;
            }
        }

        defineCustomElement('test-a', A);

        //@ts-ignore
        class B extends A {

            static get styles(): string {

                return [
                    super.styles,
                    css`span { display: inline-block; }`
                ].join('');
            }
        }

        defineCustomElement('test-b', B);

        expect(B.metadata.styles).toEqual('div { color: red; }span { display: inline-block; }');

    });
});