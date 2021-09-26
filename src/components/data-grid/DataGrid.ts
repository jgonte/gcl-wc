import CustomElement from "../../custom-element/CustomElement";
import oneOf from "../../custom-element/helpers/oneOf";
import html from "../../virtual-dom/html";
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
                type: oneOf(Array, Function),
                required: true
            },

            /**
             * The descriptor of the fields to render each row
             */
            fields: {
                type: oneOf(Array, Function),
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

		return data.map(record => html`<gcl-data-row fields=${fields} record='${record}' key="tbd"></gcl-data-row>`);
    }
}

customElements.define('gcl-data-grid', DataGrid as any);