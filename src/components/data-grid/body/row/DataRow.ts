import CustomElement from "../../../../custom-element/CustomElement";
import oneOf from "../../../../custom-element/helpers/oneOf";
import html from "../../../../virtual-dom/html";
import { config } from "../../../config";
import styles from "./DataRow.css";

export default class DataRow extends CustomElement {

    static get styles() {

        return styles;
    }

    static get properties() {

        return {

            /**
             * The record to render the row from
             */
            record: {
                type: oneOf(Object, Function),
                required: true
            },

            /**
             * The descriptor of the fields to render the row
             */
            fields: {
                type: oneOf(Array, Function),
                required: true
            }
        };
    }

    render() {

        const {
            record,
            fields
        } = this;

        return fields.map(field => {

            return (
                html`<gcl-data-cell field='${field}' record='${record}'></gcl-data-cell>`
            );
        });
    }
}

customElements.define(`${config.tagPrefix}-data-row`, DataRow as any);