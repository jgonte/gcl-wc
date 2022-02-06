import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import { NodePatchingData } from "../../renderer/NodePatcher";
import html from "../../renderer/html";
import styles from "./Alert.css";

//@ts-ignore
export default class Alert extends
    SizableMixin(
        KindMixin(
            CustomElement
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * Whether to show the icon
             */
            showIcon: {
                type: Boolean,
                value: true
            },

            /**
             * What action to execute when the alert has been closed
             * If it is not defined, then the close tool will not be shown
             */
            close: {
                type: Function
            }

        };
    }

    render(): NodePatchingData {

        return html`<gcl-row>
            ${this._renderIcon()}
            <slot></slot>
            ${this._renderCloseTool()}
        </gcl-row>`;
    }

    private _renderIcon(): NodePatchingData {

        const {
            showIcon,
            kind,
            size
        } = this;

        if (showIcon !== true) {

            return null;
        }

        return html`<gcl-icon name=${this._getIconName()} kind=${kind} size=${size}></gcl-icon>`;
    }

    private _getIconName(): string {

        switch (this.kind) {

            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }

    private _renderCloseTool(): NodePatchingData {

        const {
            kind,
            size,
        } = this;

        if (this.close === undefined) {

            return null;
        }

        return html`<gcl-close-tool kind=${kind} size=${size} close=${evt => this.close(evt)} />`;
    }
}

defineCustomElement('gcl-alert', Alert);