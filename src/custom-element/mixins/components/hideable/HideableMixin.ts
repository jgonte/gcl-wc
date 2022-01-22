import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
import styles from "./HideableMixin.css";

const HideableMixin = Base =>

    class Hideable extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, styles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                hidden: {
                    type: Boolean,
                    value: false,
                    mutable: true,
                    reflect: true,
                }
            };
        }
    };

export default HideableMixin;