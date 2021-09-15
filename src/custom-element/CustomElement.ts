import ReactiveElementMixin from "./mixins/ReactiveElementMixin";
import VirtualDomMixin from "./mixins/VirtualDomMixin";
import ShadowRootMixin from "./mixins/ShadowRootMixin";
import MetadataInitializerMixin from "./mixins/MetadataInitializerMixin";

export default class CustomElement extends
    ReactiveElementMixin(
        VirtualDomMixin(
            ShadowRootMixin(
                MetadataInitializerMixin(
                    HTMLElement
                )
            )  
        )
    ) {
}