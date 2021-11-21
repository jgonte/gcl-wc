import config from "../../config";
import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";
import styles from "./Icon.css";

const {
    assetsFolder
} = config;

//The path to the icons svg file
const _iconsPath = `${assetsFolder}/icon/assets/bootstrap-icons.svg`;

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

        return html`<svg role="img" 
            <!-- size={size} variant={variant} dir={this.getDir()}  -->
            >
                <use href={${_iconsPath}#${name}} />
            </svg>`;
    }
}

defineCustomElement('gcl-icon', Icon);