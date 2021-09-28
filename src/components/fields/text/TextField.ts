import { Field } from "../Field";
import html from "../../../virtual-dom/html";
import { EMPTY_STRING } from "../../../utils/shared";

export default class TextField extends Field {

    static get styles() {

        return super.styles;
    }

    render() {

        const {
            name,
            value,
            //required,
            disabled
        } = this;

        return html`<input
            type="text"
            name=${name}
            value=${value}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${event => this.handleBlur(event)}
            ${disabled !== undefined ? `disabled=${disabled}` : EMPTY_STRING}
        />`;
    }
}

customElements.define('gcl-text-field', TextField as any);