import Field from "../Field";
import defineCustomElement from "../../../custom-element/helpers/defineCustomElement";
import html  from "../../../renderer/html";
import { NodePatchingData } from "../../../renderer/NodePatcher";

export default class TextField extends Field {

    render(): NodePatchingData {

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
            disabled=${disabled}
        />`;
    }
}

defineCustomElement('gcl-text-field', TextField);