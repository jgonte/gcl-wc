import styles from "./SizableMixin.css";

const SizableMixin = Base =>

    class Sizable extends Base {

        static get styles() : string {

            if (this.atomic === true) { // Do not include the SizableMixin styles

                return super.styles;
            }
            else {

                return [super.styles, styles].join('');
            }
        }

        static get properties() {

            return {

                size: {
                    type: String,
                    value: 'medium',
                    mutable: true,
                    reflect: true,
                    //passToChildren: true,
                    options: ['large', 'medium', 'small']
                }
            };
        }
    };

export default SizableMixin;