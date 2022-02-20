import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import { NodePatchingData } from "../../renderer/NodePatcher";

/**
 * Component that uses data and a template to generate its content
 */
export default class TemplatedItem extends CustomElement {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The data used by the template to generate the markup
             */
            data: {
                type: [Object, Function],
                required: true
            },

            /**
             * The template to render the item
             */
            template: {
                type: Function,
                defer: true, // Store the function itself instead of executing it to get its return value when initializing the property
                required: true
            }
        }
    }

    render(): NodePatchingData {

        const {
            data,
            template
        } = this;

        return template(data);
    }
}

defineCustomElement('gcl-templated-item', TemplatedItem);