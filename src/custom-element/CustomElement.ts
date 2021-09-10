import MetadataInitializerMixin from "./mixins/MetadataInitializerMixin";

export default class CustomElement extends
    MetadataInitializerMixin(
        HTMLElement
    ) {
}