import CustomElement from "../../../custom-element/CustomElement";
import html from "../../../virtual-dom/html";

export class DataHeader extends CustomElement {
    
    render() {

        return html`header`;
    }
}

customElements.define('gcl-data-header', DataHeader as any);