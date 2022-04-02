import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import DroppableMixin from "../../custom-element/mixins/components/droppable/DroppableMixin";
import html from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
//import styles from "./Droppable.css";

/**
 * Wrapper to allow selection when clicked for the child element
 */
export default class Droppable extends
    DroppableMixin(
        CustomElement
    ) {

    // static get styles(): string {

    //     return styles as any;
    // }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-droppable', Droppable);