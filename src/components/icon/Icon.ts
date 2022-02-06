import config from "../../config";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import DirectionMixin from "../../custom-element/mixins/components/direction/DirectionMixin";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import html  from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import styles from "./Icon.css";

const {
    assetsFolder
} = config;

const _iconsPath = `${window.location.origin}/${assetsFolder}/icons/bootstrap-icons.svg`;

//@ts-ignore
export default class Icon extends
    DirectionMixin(
        SizableMixin(
            KindMixin(
                CustomElement
            )
        )
    ) {

    static atomic = true;

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the icon
             */
            name: {
                type: String,
                required: true
            }
        };
    }

    render(): NodePatchingData {

        const {
            name
        } = this;

        const iconPath = `${_iconsPath}#${name}`;

        return html`<svg role="img">
            <use href=${iconPath} />
        </svg>`;
    }
}

defineCustomElement('gcl-icon', Icon);