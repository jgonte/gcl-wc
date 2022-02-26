import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
import HoverableMixin from "../hoverable/HoverableMixin";
import styles from "./SelectableMixin.css";

export const selectionChanged = 'selectionChanged';

/**
 * Allows a component to be selected when clicked
 */
const SelectableMixin = Base =>

    class Selectable extends
        HoverableMixin( // Selectable items are also hoverable by default
            Base
        ) {

        static get styles(): string {

            return mergeStyles(super.styles, styles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is selectable
                 */
                selectable: {
                    type: Boolean,
                    value: true,
                    reflect: true,
                    inherit: true
                },

                /**
                 * Whether the item is selected
                 */
                selected: {
                    type: Boolean,
                    mutable: true, // It also acts as state
                    reflect: true
                },

                /**
                 * The value to return when the component gets selected
                 */
                selectValue: {
                    attribute: 'select-value',
                    type: [String, Object]
                }
            };
        }

        constructor() {

            super();

            this.toggleSelect = this.toggleSelect.bind(this);
        }

        connectedCallback() {

            super.connectedCallback?.();

            this.addEventListener('click', this.toggleSelect);
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            this.removeEventListener('click', this.toggleSelect);
        }

        toggleSelect() {

            let {
                selected
            } = this;

            selected = !selected; // Toggle

            this._setSelection(selected);
        }

        /**
         * Select this component programmatically
         */
        select() {

            let {
                selected
            } = this;

            if (selected === true) {

                return;
            }

            this._setSelection(true);
        }

        private _setSelection(selected: boolean) {

            if (!this.selectable) {

                return;
            }

            if (this.selected === selected) {

                return; // Nothing to select
            }

            this.selected = selected;

            this.dispatchEvent(new CustomEvent(selectionChanged, {
                detail: {
                    element: this,
                    selected,
                    value: this.selectValue
                },
                bubbles: true,
                composed: true
            }));
        }
    };

export default SelectableMixin;