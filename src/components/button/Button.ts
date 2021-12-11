import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import { Callback, CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import { html } from "../../renderer/renderer";
import styles from "./Button.css";

//@ts-ignore
export default class Button extends
    SizableMixin(
        KindMixin(
            CustomElement
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The variant of the button
             */
            variant: {
                type: String,
                value: 'outlined',
                mutable: true,
                reflect: true,
                options: ['outlined', 'text', 'contained']
            },

            /**
             * Callback when the button is clicked
             */
            click: {
                type: Callback
            }
        };
    }

    render() {

        return html`
        <button
            onClick=${this.click}
        >
            <slot></slot>
        </button>`;
    }
}

defineCustomElement('gcl-button', Button);