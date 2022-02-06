import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/helpers/defineCustomElement";
import mergeStyles from "../../custom-element/helpers/mergeStyles";
import { CustomElementPropertyMetadata } from "../../custom-element/interfaces";
import KindMixin from "../../custom-element/mixins/components/kind/KindMixin";
import SizableMixin from "../../custom-element/mixins/components/sizable/SizableMixin";
import html  from "../../renderer/html";
import { NodePatchingData } from "../../renderer/NodePatcher";
import appCtrl from "../app/appCtrl";
import styles from "./LocalizedText.css";

//@ts-ignore
export default class LocalizedText extends
    SizableMixin(
        KindMixin(
            CustomElement
        )
    ) {

    static atomic = true;

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The key to retrieve a localized value from an i18n provider
             */
            resourceKey: {
                attribute: 'resource-key',
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

            /**
             * The value of the translated resource
             */
            value: {
                type: String,
                mutable: true,
                reflect: true
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        const {
            lang,
            resourceKey
        } = this;

        if (resourceKey !== undefined) {

            const {
                intlProvider
            } = appCtrl;

            intlProvider.subscribe(this);

            this.value = intlProvider.getTranslation(lang, resourceKey);
        }
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        const {
            resourceKey
        } = this;

        if (resourceKey) {

            appCtrl.intlProvider.unsubscribe(this);
        }
    }

    render(): NodePatchingData {

        const {
            value
        } = this;

        if (value === undefined) {

            return html`<slot></slot>`;
        }
        else {

            return html`${value}`;
        }
    }

    handleLanguageChanged(provider) {

        const {
            resourceKey,
            lang
        } = this;

        this.value = provider.getTranslation(lang, resourceKey);
    }
}

defineCustomElement('gcl-localized-text', LocalizedText);