import CustomElement from "../../../../custom-element/CustomElement";
import html from "../../../../virtual-dom/html";

export class DataHeaderCell extends CustomElement {
    
    render() {

        return html`cell`;
    }
}

customElements.define('gcl-data-header-cell', DataHeaderCell as any);