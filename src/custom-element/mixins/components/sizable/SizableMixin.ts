import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
import styles from "./SizableMixin.css";

const SizableMixin = Base =>

    class Sizable extends Base {

        static get styles(): string {

            if (this.atomic === true) { // Do not include the SizableMixin styles

                return super.styles;
            }
            else {

                return mergeStyles(super.styles, styles);
            }
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                size: {
                    type: String,
                    value: 'medium',
                    mutable: true,
                    reflect: true,
                    inherit: true,
                    options: ['small', 'large', 'medium']
                }
            };
        }
    };

export default SizableMixin;