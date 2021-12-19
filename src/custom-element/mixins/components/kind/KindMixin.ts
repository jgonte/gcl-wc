import { CustomElementPropertyMetadata } from "../../../interfaces";
import styles from "./KindMixin.css";

/**
 * The kind of component in terms of funcionality
 * @param Base 
 * @returns 
 */
const KindMixin = Base =>

    class Kind extends Base {

        static get styles(): string {

            return styles as any;
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                kind: {
                    type: String,
                    inherit: true,
                    options: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
                    // mutable: true,
                    // reflect: true,
                }
            };
        }
    };

export default KindMixin;