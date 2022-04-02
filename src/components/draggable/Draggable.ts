import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import DraggableMixin from "../../custom-element/mixins/components/draggable/DraggableMixin";
import html from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
//import styles from "./Draggable.css";

/**
 * Wrapper to allow selection when clicked for the child element
 */
export default class Draggable extends
    DraggableMixin(
        CustomElement
    ) {

    // static get styles(): string {

    //     return styles as any;
    // }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-draggable', Draggable);