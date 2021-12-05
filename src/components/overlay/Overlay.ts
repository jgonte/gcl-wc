import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";
import styles from "./Overlay.css";

export default class Overlay extends CustomElement {

    static get styles(): string {

        return styles as any;
    }

    render() {

        return html`<slot></slot>`;
    }
}

defineCustomElement('gcl-overlay', Overlay);