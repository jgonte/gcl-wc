//import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
//import styles from "./DraggableMixin.css";

/**
 * Allows a component to be selected when clicked
 */
const DraggableMixin = Base =>

    class Draggable extends Base {

        // static get styles(): string {

        //     return mergeStyles(super.styles, styles);
        // }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is draggable
                 */
                // draggable: {
                //     type: Boolean,
                //     value: true, // Draggable by default
                //     reflect: true
                // },

                /**
                 * Data to be tranferred when dragging
                 */
                data: {
                    type: [Object, Function]
                }
            };
        }

        constructor() {

            super();

            this.handleDragStart = this.handleDragStart.bind(this); // Bind to the draggable element since might get assigned to the parent one
        }

        connectedCallback() {

            super.connectedCallback?.();

            const {
                _adoptingParent: parent
            } = this;

            parent.setAttribute('draggable', true);

            parent.addEventListener('dragstart', this.handleDragStart);
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            const {
                _adoptingParent: parent
            } = this;

            parent.removeAttribute("draggable");

            parent.removeEventListener('dragstart', this.handleDragStart);
        }

        handleDragStart(evt: DragEvent) {

            const data = JSON.stringify(this.data);

            evt.dataTransfer.setData('application/json', data);
        }
    };

export default DraggableMixin;