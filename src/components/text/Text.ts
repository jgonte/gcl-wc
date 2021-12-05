import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import { html } from "../../renderer/renderer";
import appCtrl from "../app/appCtrl";
import styles from "./Text.css";

//@ts-ignore
export default class Text extends
    SizableMixin(
        KindMixin(
            CustomElement
        )
    ) {

    static atomic = true;

    static get styles(): string {

        return [super.styles, styles].join('');
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

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
            }
        };
    }

    render() {

        const {
            intlKey,
            lang
        } = this;

        let value; // The value of the text is retrieved dynamically from the language

        if (intlKey !== undefined) {

            value = appCtrl.intlProvider.getTranslation(lang, intlKey);
        }

        if (value === undefined) {

            return html`<slot></slot>`;
        }
        else {

            return html`${value}`;
        }
    }

    handleLanguageChanged(provider) {

        this.setValue(provider.getTranslation(this.lang, this.intlKey));
    }

}

defineCustomElement('gcl-text', Text);