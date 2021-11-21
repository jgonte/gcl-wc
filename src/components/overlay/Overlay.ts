import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";
import styles from "./Overlay.css";

export default class Overlay extends CustomElement {

    static get styles() {

        return styles;
    }
    
    render() {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-overlay', Overlay);