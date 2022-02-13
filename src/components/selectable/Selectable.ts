import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import SelectableMixin from "../../custom-element/mixins/components/selectable/SelectableMixin";
import html from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
//import styles from "./Selectable.css";

/**
 * Wrapper to allow selection when clicked for the child element
 */
export default class Selectable extends
    SelectableMixin(
        CustomElement
    ) {

    // static get styles(): string {

    //     return styles as any;
    // }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-selectable', Selectable);