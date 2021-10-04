import { DiffOperation, LifecycleHooks } from "../../virtual-dom/interfaces";
import MarkupParsingResult from "../../virtual-dom/MarkupParsingResult";
import ElementNode from "../../virtual-dom/nodes/ElementNode";
import FragmentNode from "../../virtual-dom/nodes/FragmentNode";
import TextNode from "../../virtual-dom/nodes/TextNode";

/**
 * Updates the element using a virtual DOM approach
 * @param Base 
 * @returns 
 */
const VirtualDomMixin = Base =>

    class VirtualDom extends Base implements LifecycleHooks {

        didMountCallback?: () => void;

        willUpdateCallback?: () => void;

        didUpdateCallback?: () => void;

        willUnmountCallback?: () => void;

        /**
         * The old virtual node to diff against
         */
        private _oldResult: MarkupParsingResult = null;

        /**
         * The set of children nodes that are removed every time of one them gets mounted/updated to
         * allow to call the respective callback after in the parent after the children have been mounted/updated
         */
        private _childrenToUpdate: Set<Node> = undefined;

        protected updateDom() {

            let newResult: MarkupParsingResult = this.render();

            if (Array.isArray(newResult)) { // An array of results was returned from an map -> html call

                newResult = wrap(newResult);
            }

            // Modify the original render if needed
            newResult = this.beforeRender(newResult);

            const operation = this._getOperation(newResult);

            switch (operation) {
                case DiffOperation.None: return; // Nothing to do
                case DiffOperation.Mount:
                    {
                        this.willMount();

                        this.document.insertBefore(newResult.node, null); // Faster than appendChild

                        this.didMount(); // Protected method to ensure the children are mounted first before calling didMountCallback on the parent
                    }
                    break;
                case DiffOperation.Update:
                    {
                        this.willUpdateCallback?.();

                        this.willUpdate();

                        newResult.patch(this._oldResult, this.document);

                        this.didUpdate(); // Protected method to ensure the children are updated first before calling didUpdateCallback on the parent
                    }
                    break;
                case DiffOperation.Unmount:
                    {
                        this.willUnmountCallback?.();

                        (this.document as HTMLElement).replaceChildren(); // Remove all the existing children
                    }
                    break;
            }

            this._oldResult = newResult;
        }

        private _getOperation(newResult: MarkupParsingResult): DiffOperation {

            if (this._oldResult === null) {

                if (newResult === null) {

                    return DiffOperation.None;
                }
                else { // newVNode !== null

                    return DiffOperation.Mount;
                }
            }
            else { // this._oldVNode !== null

                if (newResult === null) {

                    return DiffOperation.Unmount;
                }
                else { // newVNode !== null

                    return DiffOperation.Update;
                }
            }
        }

        beforeRender(newResult: MarkupParsingResult): MarkupParsingResult {

            const styles = (this.constructor as any).metadata.styles;

            if (styles.length > 0) { // Add a style element to the node

                return this.addStyles(newResult, styles);
            }

            return newResult;
        }

        addStyles(result: MarkupParsingResult, styles: string[]): MarkupParsingResult {

            if (this.shadowRoot !== null) {

                const styleVNode = new ElementNode(
                    'style',
                    null,
                    [
                        new TextNode(styles.join(''))
                    ]
                );

                result = result.appendSibling(new MarkupParsingResult(styleVNode, styleVNode.createDom()));

            }
            else { // this.shadowRoot === null

                throw Error('Not implemented');
            }

            return result;
        }

        private _initializeChildrenToUpdate() {

            if (this.adoptedChildren.size > 0) {

                this._childrenToUpdate = new Set<Node>(this.adoptedChildren);
            }
        }

        protected willMount() {

            this._initializeChildrenToUpdate();
        }

        protected async didMount() {

            if (this.adoptedChildren.size == 0) { // It is a leaf node

                this._notifyDidMount();
            }
        }

        protected childDidMount(child: Node, callback: Function) {

            this._childrenToUpdate.delete(child);

            if (this._childrenToUpdate.size === 0) { // Copy the children that need to be removed when updated

                this._notifyDidMount();
            }
        }

        private _notifyDidMount() {

            this.callAttributesChange();

            this.didMountCallback?.();

            if (this.adoptingParent !== null) { // Let the adopting parent know that the child was mounted/updated 

                this.adoptingParent.childDidMount(this);
            }
        }

        protected willUpdate() {

            this._initializeChildrenToUpdate();
        }

        protected async didUpdate() {

            if (this.adoptedChildren.size == 0) { // It is a leaf node

                this._notifyDidUpdate();
            }
        }

        protected childDidUpdate(child: Node, callback: Function) {

            this._childrenToUpdate.delete(child);

            if (this._childrenToUpdate.size === 0) { // Copy the children that need to be removed when updated

                this._notifyDidUpdate();
            }
        }

        private _notifyDidUpdate() {

            this.callAttributesChange();

            this.didUpdateCallback?.();

            if (this.adoptingParent !== null) { // Let the adopting parent know that the child was mounted/updated 

                this.adoptingParent.childDidUpdate(this);
            }
        }
    }

export default VirtualDomMixin;

/**
 * Wraps the array of results in a fragment node one
 * @param results 
 * @returns 
 */
function wrap(results: MarkupParsingResult[]): MarkupParsingResult {

    const wrapperVNode = new FragmentNode(results.map(r => r.vnode) as any);

    const wrapperNode = new DocumentFragment();

    results.forEach(r => wrapperNode.insertBefore(r.node, null));

    return new MarkupParsingResult(wrapperVNode, wrapperNode);
}
