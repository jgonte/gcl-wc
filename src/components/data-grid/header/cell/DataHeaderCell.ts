import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../../custom-element/interfaces";
import html  from "../../../../renderer/html";
import { NodePatchingData } from "../../../../renderer/NodePatcher";
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
            field
        } = this;

        const name = typeof field === 'string' ?
            field :
            field.name;

        return html`${name}`;
    }
}

defineCustomElement('gcl-data-header-cell', DataHeaderCell);