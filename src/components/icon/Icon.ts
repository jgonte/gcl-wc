import config from "../../config";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import DirectionMixin from "../../custom-element/mixins/components/direction/DirectionMixin";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import { html } from "../../renderer/renderer";
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

        return [super.styles, styles].join('');
    }

    static get properties() {

        return {

            /**
             * The name of the icon
             */
            name: {
                type: String,
                value: '',
                required: true
            }
        };
    }

    render() {

        const {
            name
        } = this;

        const iconPath = `${_iconsPath}#${name}`;

        return html`
            <svg role="img">
                <use href=${iconPath} />
            </svg>`;
    }
}

defineCustomElement('gcl-icon', Icon);