import ParentMixin from "./mixins/ParentMixin";
import ChildMixin from "./mixins/ChildMixin";
import ReactiveElementMixin from "./mixins/ReactiveElementMixin";
import VirtualDomMixin from "./mixins/VirtualDomMixin";
import ShadowRootMixin from "./mixins/ShadowRootMixin";
import MetadataInitializerMixin from "./mixins/MetadataInitializerMixin";

export default class CustomElement extends
    ParentMixin(
        ChildMixin(
            ReactiveElementMixin(
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
