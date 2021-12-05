import ParentChildMixin from "./mixins/core/ParentChildMixin";
import ReactiveElementMixin from "./mixins/core/ReactiveElementMixin";
import StylePatcherMixin from "./mixins/core/StylePatcherMixin";
import VirtualDomMixin from "./mixins/core/VirtualDomMixin";
import ShadowRootMixin from "./mixins/core/ShadowRootMixin";
import MetadataInitializerMixin from "./mixins/core/MetadataInitializerMixin";

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
