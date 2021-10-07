import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
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
                type: [Array, Function],
                required: true
            }
        };
    }

    render() {

        return this.fields.map(field => {

            return html`<gcl-data-header-cell field=${field} key=${field}></gcl-data-header-cell>`;
        });
    }
}

defineCustomElement('gcl-data-header', DataHeader);