import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import LoadableMixin from "../../custom-element/mixins/data/LoadableMixin";
import html  from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";

/**
 * Wrapper to allow loading data for a child component
 */
export default class Loader extends
    LoadableMixin(
        CustomElement
    ) {

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
 
    didMountCallback() {

        // Bind to the data property of the child (assuming a single child)
        this.dataHolder = this.document.childNodes[0].assignedElements({ flatten: false })[0]; // Do not include nodes

        super.didMountCallback?.();
    }

    handleLoadedData(data) {

        this.dataHolder.data = data.payload || data;
    }
}

defineCustomElement('gcl-loader', Loader);