import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import { html } from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import styles from "./DataHeader.css";

export default class DataHeader extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the fields to render the header
             */
            fields: {
                type: [Array, Function],
                required: true
            }
        };
    }

    render(): NodePatchingData[] {

        return this.fields.map(field => {

            return html`<gcl-data-header-cell field=${field} key=${field}></gcl-data-header-cell>`;
        });
    }
}

defineCustomElement('gcl-data-header', DataHeader);