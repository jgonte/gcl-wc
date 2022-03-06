import CustomElement from "../../custom-element/CustomElement";
import getStyle from "../../custom-element/helpers/css/style/getStyle";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import SelectionContainerMixin from "../../custom-element/mixins/components/selection-container/SelectionContainerMixin";
import DataHolderMixin from "../../custom-element/mixins/data/DataHolderMixin";
import html from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";

const defaultItemStyle = `
    list-style-type: none;
`;

export default class DataList extends
    SelectionContainerMixin(
        DataHolderMixin(
            CustomElement
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field to extract the value to display on each item
             */
            displayField: {
                attribute: 'display-field',
                type: String
            },

            /**
             * The style of each list item
             */
            itemStyle: {
                attribute: 'item-style',
                type: [String, Object, Function]
            },

            /**
             * The template to render the item
             */
            itemTemplate: {
                attribute: 'item-template',
                type: Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
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

        return data.map(record => {

            const id = record[idField];

            return html`<li key=${id} style=${this.getItemStyle()}>
                <gcl-selectable selectable=${this.selectable} select-value=${record}>${this.renderItem(record)}</gcl-selectable>
            </li>`;
        });
    }

    getItemStyle(): string {

        const {
            itemStyle
        } = this;

        if (itemStyle === undefined) {

            return defaultItemStyle;
        }

        if (typeof itemStyle === 'string') {

            return `${defaultItemStyle} ${itemStyle}`;
        }
        else { // Assume it is an object

            return `${defaultItemStyle} ${getStyle(itemStyle)}`;
        }
    }

    renderItem(record: Record<string, any>): NodePatchingData {

        const {
            displayField,
            itemTemplate
        } = this;

        if (itemTemplate === undefined) {

            return html`${record[displayField]}`;
        }
        else {

            return itemTemplate(record);
        }
    }
}

defineCustomElement('gcl-data-list', DataList);