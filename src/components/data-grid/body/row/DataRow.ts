import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../../custom-element/interfaces";
import { html } from "../../../../renderer/html";
import styles from "./DataRow.css";

export default class DataRow extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The record to render the row from
             */
            record: {
                type: [Object, Function],
                required: true
            },

            /**
             * The descriptor of the fields to render the row
             */
            fields: {
                type: [Array, Function],
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
                html`<gcl-data-cell field=${field} record=${record} key=${field}></gcl-data-cell>`
            );
        });
    }
}

defineCustomElement('gcl-data-row', DataRow);