import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import findChild from "../../../custom-element/helpers/findChild";
import { CustomElementPropertyMetadata } from "../../../custom-element/interfaces";
import SelectionContainerMixin from "../../../custom-element/mixins/components/selection-container/SelectionContainerMixin";
import html from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";
import Field from "../Field";

export default class ComboBox extends
    SelectionContainerMixin(
        Field
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {
            /**
             * The template to render the header of the combo box
             */
            headerTemplate: {
                attribute: 'header-template',
                type: Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            selectTemplate: {
                attribute: 'select-template',
                type: Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            singleSelectionTemplate: {
                attribute: 'single-selection-template',
                type: Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            multipleSelectionTemplate: {
                attribute: 'multiple-selection-template',
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

    renderHeader(): NodePatchingData {

        const {
            selection
        } = this;

        switch (selection.length) {
            case 0: return this.renderSelectTemplate();
            case 1: return this.renderSingleSelectionTemplate(selection[0]);
            default: return this.renderMultipleSelectionTemplate(selection);
        }
    }

    renderSelectTemplate() : NodePatchingData {

        const {
            selectTemplate
        } = this;

        if (selectTemplate !== undefined) {

            return selectTemplate();
        }
        else {

            return html`<gcl-localized-text intl-key="please-select">Please select</gcl-localized-text>`;
        }
    }

    renderSingleSelectionTemplate(selection) : NodePatchingData {

        const {
            singleSelectionTemplate,
            container
        } = this;

        if (singleSelectionTemplate !== undefined) {

            return singleSelectionTemplate(selection);
        }
        else {

            return html`<span>${selection[container.displayField]}</span>`;
        }
    }

    renderMultipleSelectionTemplate(selection) : NodePatchingData {

        const {
            multipleSelectionTemplate,
            container
        } = this;

        if (multipleSelectionTemplate !== undefined) {

            return multipleSelectionTemplate(selection);
        }
        else {

            const {
                idField,
                displayField
            } = container;

            const data = selection.map(item => {
                
                return {
                    [idField]: item[idField],
                    [displayField]: item[displayField]
                };
            });

            return html`<gcl-data-list data=${data} id-field=${idField} display-field=${displayField} selectable="false"></gcl-data-list>`;
        }
    }

    didMountCallback() {

        super.didMountCallback?.();

        // If the slotted content is a selection container, then attach the update header to the selectionChanged property
        const content = this.document.getElementById('content');

        const container = findChild(
            content.assignedElements({ flatten: false }),
            child => child.isSelectionContainer === true
        ) as any;

        const selectionChangedHandler = container.selectionChanged;

        if (selectionChangedHandler === undefined) {

            container.selectionChanged = selection => this.selection = selection;
        }
        else {

            container.selectionChanged = selection => {

                this.selection = selection;

                selectionChangedHandler(selection); // Include the original handler
            }
        }

        this.container = container; // Needed to reference to get idField and displayField
    }

}

defineCustomElement('gcl-combo-box', ComboBox);