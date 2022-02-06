import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import html  from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import styles from "./Badge.css";

export default class Badge extends
    KindMixin(
        CustomElement
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-badge', Badge);