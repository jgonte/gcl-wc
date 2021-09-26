import CustomElement from "../../../../../custom-element/CustomElement";
import oneOf from "../../../../../custom-element/helpers/oneOf";
import html from "../../../../../virtual-dom/html";
import styles from "./DataCell.css";

export default class DataCell extends CustomElement {

    static get styles() {

        return styles;
    }

    static get properties() {

        return {

            /**
             * The record to render the cell from
             */
            record: {
                type: oneOf(Object, Function),
                required: true
            },

            /**
             * The descriptor of the field to render the cell
             */
            field: {
                type: oneOf(Object, Function, String),
                required: true
            }
        };
    }

    render() {

        const {
            field,
            record           
        } = this;

        const name = typeof field === 'string' ?
            field:
            field.name;

        const value = record[name];

        return html`${value}`;
    }
}

customElements.define('gcl-data-cell', DataCell as any);