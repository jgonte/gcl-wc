import CustomElement from "../../custom-element/CustomElement";
import getClasses from "../../custom-element/helpers/css/style/class/getClasses";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import popupManager from "../../custom-element/helpers/managers/popupManager";
import { CustomElementStateMetadata } from "../../custom-element/interfaces";
import { html } from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import { dropChanged } from "../tools/drop/DropTool";
import styles from "./DropDown.css";

export default class DropDown extends CustomElement  {

    static get styles(): string {

        return styles as any;
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            showing: {
                value: false
            }
        };
    }

    constructor() {

        super();

        this.handleDropChanged = this.handleDropChanged.bind(this);
    }

    render(): NodePatchingData {

        const {
            showing
        } = this;

        const contentClasses = getClasses({
            'dropdown-content': true,
            'show': showing
        });

        return html`<div tabindex="0" class="dropdown">
            <gcl-row>
                <slot id="header" name="header"></slot>
                <gcl-drop-tool id="drop-tool"></gcl-drop-tool>
            </gcl-row>
            <div class=${contentClasses}>
                <slot name="content"></slot>
            </div>
        </div>`;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(dropChanged, this.handleDropChanged);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(dropChanged, this.handleDropChanged);
    }

    handleDropChanged(evt: CustomEvent) {

        evt.stopPropagation();

        const {
            showing
        } = evt.detail;

        if (showing === true) { // Hide the contents of other showing dropdowns and set this one as being shown

            popupManager.setShown(this as any);
        }

        this.showing = showing;
    }

    hideContent() {

        const dropTool = this.document.getElementById('drop-tool');

        dropTool.hideContent();

        popupManager.setHidden(this as any);
    }
}

defineCustomElement('gcl-drop-down', DropDown);