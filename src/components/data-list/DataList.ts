import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import DataHolderMixin from "../../custom-element/mixins/data/DataHolderMixin";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";

export default class DataList extends
    DataHolderMixin(
        CustomElement
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field to extract the value to display on each item
             */
            displayField: {
                attribute: 'display-field',
                type: String
            }
        };
    }

    render(): NodePatchingData {

        return html`<ul>
            ${this.renderItems()}
        </ul>`;
    }

    renderItems(): NodePatchingData {

        const {
            data,
            idField
        } = this;

        return data.map(record => html`<li key=${record[idField]}>
            ${this.renderItem(record)}
        </li>`);
    }

    renderItem(record: Record<string, any>): NodePatchingData {

        const {
            displayField
        } = this;

        return html`${record[displayField]}`;
    }
}

defineCustomElement('gcl-data-list', DataList);