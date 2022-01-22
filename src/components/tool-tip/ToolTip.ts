import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import styles from "./ToolTip.css";

export default class ToolTip extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    render(): NodePatchingData {

        // return html`
        //     
        //     <slot name="content"></slot>
        // `;

        return html`<div class="tooltip">
            <slot name="trigger"></slot>
            <span id="content">
                <slot name="content"></slot>
            </span>
        </div>`;
    }

    didMountCallback() {

        this._positionContent();
    }

    didUpdateCallback() {

        this._positionContent();
    }

    /**
     * Positions the content since we don't know its dimensions until it is rendered in the DOM
     */
    private _positionContent() {

        const content = this.document.getElementById("content");

        //applyStyle``(content);

        alert(content.outerHTML);
    }
}

defineCustomElement('gcl-tool-tip', ToolTip);