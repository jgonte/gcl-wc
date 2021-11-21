import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { html } from "../../renderer/renderer";

export default class Text extends CustomElement {

    static properties = {

        /**
         * The key to retrieve a localized value from an i18n provider
         */
        intlKey: {
            attribute: 'intl-key',
            type: String
        },

        /**
         * The language to translate to
         */
        lang: {
            type: String,
            mutable: true,
            reflect: true
        },

        // /** 
        //  * The value of the text
        //  */
        // value: {
        //     type: String,
        //     mutable: true,
        //     reflect: true
        // }
    };

    render() {

        return html``;
    }

    handleLanguageChanged(provider) {

        this.setValue(provider.getTranslation(this.lang, this.intlKey));
    }

}

defineCustomElement('gcl-text', Text);