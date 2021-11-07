import CustomElement from "../../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../../../renderer/renderer";
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
                type: [Object, Function],
                required: true
            },

            /**
             * The descriptor of the field to render the cell
             */
            field: {
                type: [Object, Function, String],
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

defineCustomElement('gcl-data-cell', DataCell);