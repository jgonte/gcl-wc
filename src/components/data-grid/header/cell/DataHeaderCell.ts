import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../../renderer/renderer";
import styles from "./DataHeaderCell.css";

export default class DataHeaderCell extends CustomElement {

    static get styles() {

        return styles;
    }
    
    static get properties() {

        return {

            /**
             * The descriptor of the field to render the header cell
             */
            field: {
                type: [Object, Function, String],
                required: true
            }
        };
    }

    render() {

        const {
            field          
        } = this;

        const name = typeof field === 'string' ?
            field:
            field.name;

        return html`${name}`;
    }
}

defineCustomElement('gcl-data-header-cell', DataHeaderCell);