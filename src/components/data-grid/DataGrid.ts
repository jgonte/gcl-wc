import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";
import styles from "./DataGrid.css";

export default class DataGrid extends CustomElement {

    static get styles() {

        return styles;
    }

	static get properties() {

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

    render() {

        return html`
			${this.renderHeader()}
			${this.renderBody()}         
        `;
    }

    renderHeader() {

        const 
		{
			fields
		} = this;

        return html`<gcl-data-header fields=${fields}></gcl-data-header>`;
    }

    renderBody() {

        const 
		{
			fields,
			data
		} = this;

		return data.map(record => html`<gcl-data-row fields=${fields} record=${record} key="tbd"></gcl-data-row>`);
    }
}

defineCustomElement('gcl-data-grid', DataGrid);