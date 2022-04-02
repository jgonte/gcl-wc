//import mergeStyles from "../../../helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../../interfaces";
//import styles from "./DroppableMixin.css";

/**
 * Allows a component to be selected when clicked
 */
const DroppableMixin = Base =>

    class Droppable extends Base {

        // static get styles(): string {

        //     return mergeStyles(super.styles, styles);
        // }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Logic to accept a drop
                 */
                accept: {
                    type: Function,
                    defer: true, // Store the function itself instead of executing it to get its return value when initializing the property
                    required: true
                },

                /**
                 * Logic to execute on drop
                 */
                onDrop: {
                    attribute: 'on-drop',
                    type: Function,
                    defer: true, // Store the function itself instead of executing it to get its return value when initializing the property
                    required: true
                }
            };
        }

        // constructor() {

        //     super();

        //     this.toggleDroppable = this.toggleDroppable.bind(this);
        // }

        connectedCallback() {

            super.connectedCallback?.();

            this.addEventListener('dragover', this.handleDragOver);

            this.addEventListener('drop', this.handleDrop);
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            this.removeEventListener('dragover', this.handleDragOver);

            this.removeEventListener('drop', this.handleDrop);
        }

        handleDragOver(e: DragEvent): void {

            e.preventDefault();
        }

        handleDrop(e: DragEvent): void {

            const data = JSON.parse(e.dataTransfer.getData('application/json'));

            if (this.accept(data)) {

                e.preventDefault();

                this.onDrop(e.target, data);

            }
        }
    };

export default DroppableMixin;