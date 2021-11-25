import config from "../../config";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";
import styles from "./Icon.css";

const {
    assetsFolder
} = config;

//The path to the icons svg file
const _iconsPath = `${assetsFolder}/icons/bootstrap-icons.svg`;

export default class Icon extends CustomElement {

    static get styles() {

        return styles;
    }

    static properties = {

        /**
         * The name of the icon
         */
        name: {
            type: String,
            value: '',
            required: true
        }
    };

    render() {

        const {
            name,
            //size,
            //variant
        } = this;

        const iconPath = `${_iconsPath}#${name}`;

        //TODO: Add <!-- size={size} variant={variant} dir={this.getDir()}  -->
        return html`
            <svg role="img">
                <use href=${iconPath} />
            </svg>`;
    }
}

defineCustomElement('gcl-icon', Icon);