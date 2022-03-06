import { CustomElementPropertyMetadata, CustomElementStateMetadata } from "../../../interfaces";
import { selectionChanged } from "../selectable/SelectableMixin";

/**
 * Notifies the container when one of the selection in the children has changed
 */
const SelectionContainerMixin = Base =>

    class SelectionContainer extends Base {

        isSelectionContainer = true; // Mark the instance as a selection 

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is selectable
                 */
                selectable: {
                    type: Boolean,
                    value: true,
                    reflect: true,
                    //inherit: true
                },

                /**
                 * Whether we can process multiple selection (false by default)
                 */
                multiple: {
                    type: Boolean,
                    reflect: true
                },

                /**
                 * The selected item or items. It is an attribute since it can be passed through a property initially
                 */
                selection: {
                    type: Array,
                    value: [],
                    mutable: true,
                    reflect: true
                },

                /**
                 * The handler to call when the selection has changed
                 */
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: Function,
                    defer: true
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                /**
                 * To track the current selected child for a single selection model
                 */
                selectedChild: {
                    value: undefined
                }
            };
        }

        constructor() {

            super();

            this.updateSelection = this.updateSelection.bind(this);
        }

        attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {

            super.attributeChangedCallback?.(attributeName, oldValue, newValue);

            if (attributeName === "selectable") {

                if (newValue === "true" || newValue === "") {

                    this.addEventListener(selectionChanged, this.updateSelection);
                }
                else { // newValue === "false"

                    this.removeEventListener('selectionChanged', this.updateSelection);
                }
            }
        }

        updateSelection(event: CustomEvent) {

            event.stopPropagation();

            const {
                multiple,
                selection,
                selectionChanged
            } = this;

            const {
                element,
                selected,
                value
            } = event.detail;

            if (multiple !== undefined) {

                if (selected === true) { // Add the value to the selection

                    this.selection = [...selection, value];
                }
                else { // Remove the value from the selection

                    this.selection = selection.filter(item => item.id !== value.id);
                }
            }
            else { // Replace the old selection with the new one

                const {
                    selectedChild
                } = this;

                // Deselect previous selected child
                if (selectedChild !== undefined) {

                    selectedChild.selected = false;
                }

                this.selection.length = 0; // Clear the selection

                if (selected === true) {

                    this.selection.push(value);

                    this.selectedChild = element;
                }
                else {

                    this.selectedChild = undefined;
                }
            }

            if (selectionChanged !== undefined) {

                selectionChanged(this.selection);
            }
        }
    };

export default SelectionContainerMixin;