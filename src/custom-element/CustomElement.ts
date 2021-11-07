import ParentChildMixin from "./mixins/ParentChildMixin";
import ReactiveElementMixin from "./mixins/ReactiveElementMixin";
import StylePatcherMixin from "./mixins/StylePatcherMixin";
import VirtualDomMixin from "./mixins/VirtualDomMixin";
import ShadowRootMixin from "./mixins/ShadowRootMixin";
import MetadataInitializerMixin from "./mixins/MetadataInitializerMixin";

export default class CustomElement extends
    ParentChildMixin(
        ReactiveElementMixin(
            StylePatcherMixin(
                VirtualDomMixin(
                    ShadowRootMixin(
                        MetadataInitializerMixin(
                            HTMLElement
                        )
                    )
                )
            )   
        )
    ) {

    dispatchCustomEvent(type: string, detail: Record<string, any>) {

        this.dispatchEvent(new CustomEvent(type, {
            detail: detail,
            bubbles: true,
            composed: true // To bubble through the shadow DOM
        }));
    }
}
