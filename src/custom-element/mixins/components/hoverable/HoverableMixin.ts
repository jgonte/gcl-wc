import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
import styles from "./HoverableMixin.css";

const HoverableMixin = Base =>

    class Hoverable extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, styles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the element is hoverable
                 */
                hoverable: {
                    type: Boolean,
                    value: true,
                    mutable: true,
                    reflect: true
                }
            };
        }
    };

export default HoverableMixin;