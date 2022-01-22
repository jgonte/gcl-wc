import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import styles from "./DataGrid.css";

export default class DataGrid extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The collection of records to render the data from
             */
            data: {
                type: [Array, Function],
                required: true
            },

            /**
             * The descriptor of the fields to render each row
             */
            fields: {
                type: [Array, Function],
                required: true
            }
        };
    }

    render(): NodePatchingData {

        return html`
			${this.renderHeader()}
			${this.renderBody()}         
        `;
    }

    renderHeader(): NodePatchingData {

        const {
            fields
        } = this;

        return html`<gcl-data-header fields=${fields}></gcl-data-header>`;
    }

    renderBody(): NodePatchingData[] {

        const {
            fields,
            data
        } = this;

        return data.map(record => html`<gcl-data-row fields=${fields} record=${record} key="tbd"></gcl-data-row>`);
    }
}

defineCustomElement('gcl-data-grid', DataGrid);