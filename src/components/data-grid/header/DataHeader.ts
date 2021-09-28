import CustomElement from "../../../custom-element/CustomElement";
import oneOf from "../../../custom-element/helpers/oneOf";
import html from "../../../virtual-dom/html";
import styles from "./DataHeader.css";

export default class DataHeader extends CustomElement {
    
    static get styles() {

        return styles;
    }

    static get properties() {

        return {

            /**
             * The descriptor of the fields to render the header
             */
            fields: {
                type: oneOf(Array, Function),
                required: true
            }
        };
    }

    render() {

        return this.fields.map(field => {

            return (
                html`<gcl-data-header-cell field=${field} key=${field}></gcl-data-header-cell>`
            );
        });
    }
}

customElements.define('gcl-data-header', DataHeader as any);