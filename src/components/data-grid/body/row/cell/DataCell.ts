import CustomElement from "../../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../../../custom-element/interfaces";
import html from "../../../../../renderer/html";
import { NodePatchingData } from "../../../../../renderer/NodePatcher";
import styles from "./DataCell.css";

export default class DataCell extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

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

    render(): NodePatchingData {

        const {
            field,
            record
        } = this;

        const name = typeof field === 'string' ?
            field :
            field.name;

        if (field.render !== undefined) {

            return field.render(record, field);
        }
        else {

            return html`${record[name]}`;
        }   
    }
}

defineCustomElement('gcl-data-cell', DataCell);