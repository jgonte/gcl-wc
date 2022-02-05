import CustomElement from "../../custom-element/CustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";

export default abstract class Tool extends
    SizableMixin(
        KindMixin(
            CustomElement
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
            iconName: {
                type: [String, Function],
                required: true
            }
        };
    }

    render(): NodePatchingData {

        const {
            kind,
            size,
            iconName,
        } = this;

        return html`<gcl-button kind=${kind} size=${size} variant="text" click=${evt => this.click(evt)}>
            <gcl-icon name=${iconName}></gcl-icon>
        </gcl-button>`;
    }
}