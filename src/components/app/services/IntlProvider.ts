import Observer from "../../../utils/observer/Observer";

export default class IntlProvider extends Observer {

  constructor(

    /**
     * The current language set in the provider
     */
    public lang: string,

    /**
     * The data with the translation
     */
    public data: any
  ) {
    super('handleLanguageChanged');
  }

  setLanguage(lang: string) {

    if (this.lang !== lang) {

      this.lang = lang;

      this.notify();
    }
  }

  /**
   * Retrieves the translated text or returns a string with the key value if the translation was not found
   */
  getTranslation(lang: string | undefined, key: string): string {

    // If the lang is not provided use the current language of the provider
    const lng = lang || this.lang;

    const data = this.data[lng];

    if (!data) {
      // There are no translations for this language

      console.error(`Missing translations for language: [${lang}]. (key was [${key}]).`);

      return `[${key}(L:${lang})]`;
    }

    const translation = data[key];

    if (!translation) {
      // There is no translation for this key in this language

      console.error(`Missing translation key: [${key}] in language: [${lang}].`);

      return `[(K:${key})${lang}]`;
    }

    return translation;
  }
}
