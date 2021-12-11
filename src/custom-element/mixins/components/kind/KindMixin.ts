import styles from "./KindMixin.css";

/**
 * The kind of component in terms of funcionality
 * @param Base 
 * @returns 
 */
const KindMixin = Base =>

    class Kind extends Base {

        static get styles() : string {

            return styles as any;
        }
   
        static get properties() {

            return {

                kind: {
                    type: String,
                    inherit: true
                    // mutable: true,
                    // reflect: true,
                }
            };
        }
    };

export default KindMixin;