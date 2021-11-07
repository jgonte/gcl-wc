import { Field } from "../Field";
import { EMPTY_STRING } from "../../../utils/shared";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import { html } from "../../../renderer/renderer";

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

defineCustomElement('gcl-text-field', TextField);