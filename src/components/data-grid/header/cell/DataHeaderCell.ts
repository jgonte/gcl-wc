import CustomElement from "../../../../custom-element/CustomElement";
import getStyle from "../../../../custom-element/helpers/css/style/getStyle";
import defineCustomElement from "../../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../../custom-element/interfaces";
import html from "../../../../renderer/html";
import { NodePatchingData } from "../../../../renderer/NodePatcher";
import DataGridFieldDescriptor from "../../DataGridFieldDescriptor";
import styles from "./DataHeaderCell.css";

export default class DataHeaderCell extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the field to render the header cell
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
        } = this;

        if (typeof field === 'string') {

            return html`${field}`;
        }
        else {

            const {
                name,
                display
            } = field as DataGridFieldDescriptor;

            if (display !== undefined) {

                if (typeof display === 'function') {

                    return this.renderCellContainer(field, display());
                }
                else {

                    return this.renderCellContainer(field, html`<span>${display}</span>`);
                }
            }
            else {

                return this.renderCellContainer(field, html`<span>${name}</span>`);
            }
        }
    }

    renderCellContainer(field: DataGridFieldDescriptor, display: NodePatchingData): NodePatchingData {

        const {
            headerStyle
        } = field as DataGridFieldDescriptor;

        if (headerStyle !== undefined) {

            const style = typeof headerStyle === 'string'?
                headerStyle :
                getStyle(headerStyle);

            return html`<gcl-row style=${style}>${display}${this.renderSorter()}</gcl-row>`;
        }
        else {

            return html`<gcl-row>${display}${this.renderSorter()}</gcl-row>`;
        }
    }

    renderSorter(): NodePatchingData {

        const {
            field
        } = this;

        if (field.sortable !== true) {

            return null;
        }

        return html`<gcl-sorter-tool field=${field.name}></gcl-sorter-tool>`;
    }
}

defineCustomElement('gcl-data-header-cell', DataHeaderCell);