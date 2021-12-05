import clearCustomElements from "../utils/clearCustomElements";
import defineCustomElement from "../../helpers/defineCustomElement";
import MetadataInitializerMixin from "../../mixins/core/MetadataInitializerMixin";

beforeEach(() => {

    clearCustomElements();
});

describe("MetadataInitializerMixin tests of the functionality of the shadow flag", () => {

    it('should have the shadow flag true by default', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {}

        defineCustomElement('test-a', A);

        expect(A.metadata.shadow).toBe(true);
    });

    it('should have the shadow flag false when it is explicitly set', () => {

        //@ts-ignore
        class A extends MetadataInitializerMixin(HTMLElement) {

            static get component() {

                return {

                    shadow: false
                };
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.shadow).toBe(false);
    });

});