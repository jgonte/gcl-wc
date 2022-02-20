import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import html from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import Field from "../Field";

export default class ComboBox extends Field {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {
            /**
             * The template to render the header of the combo box
             */
            headerTemplate: {
                attribute: 'header-template',
                type: Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            }
        };
    }
    
    render(): NodePatchingData {

        return html`<gcl-drop-down>
            <span slot="header">${this.renderHeader()}</span>
            <span slot="content">
                <slot id="content" name="content"></slot>
            </span>
        </gcl-drop-down>`;
    }

    updateHeader(selection: any[]): void {

        alert('Update header: ' + JSON.stringify(selection));
    }

    didMountCallback() {

        super.didMountCallback?.();

        // If the slotted content is a selection container, then attach the update header to the selectionChanged property
        const content = this.document.getElementById('content'); 

        const container = content.assignedNodes({ flatten: false })[0].children[0];

        const selectionChangedHandler = container.selectionChanged;

        if (selectionChangedHandler === undefined) {

            container.selectionChanged = this.updateHeader;
        }
        else {

            container.selectionChanged = selection => {

                selectionChangedHandler(selection); // Include the original handler

                this.updateHeader(selection);
            }
        }
    }

}

defineCustomElement('gcl-combo-box', ComboBox);