import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
import styles from "./DirectionMixin.css";

const DirectionMixin = Base =>

    class Direction extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, styles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                dir: {
                    type: String,    
                    reflect: true,
                    inherit: true,
                    options: ['ltr', 'rtl']
                }
            };
        }
    };

export default DirectionMixin;