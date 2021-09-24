import CustomElement from "../../../../custom-element/CustomElement";
import html from "../../../../virtual-dom/html";
import { config } from "../../../config";

export class DataHeaderCell extends CustomElement {
    
    render() {

        return html`cell`;
    }
}

customElements.define(`${config.tagPrefix}-data-header-cell`, DataHeaderCell as any);