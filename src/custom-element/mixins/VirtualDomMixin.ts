import { DiffOperation, LifecycleHooks } from "../../virtual-dom/interfaces";
import MarkupParsingResult from "../../virtual-dom/MarkupParsingResult";
// import ElementNode from "../../virtual-dom/nodes/ElementNode";
// import FragmentNode from "../../virtual-dom/nodes/FragmentNode";
// import TextNode from "../../virtual-dom/nodes/TextNode";

/**
 * Updates the element using a virtual DOM approach
 * @param Base 
 * @returns 
 */
const VirtualDomMixin = Base =>

    class VirtualDom extends Base implements LifecycleHooks {

        didMountCallback() { }

        willUpdateCallback() { };

        didUpdateCallback() { };

        willUnmountCallback() { };

        /**
         * The old virtual node to diff against
         */
        private _oldResult: MarkupParsingResult = null;

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
                        this.document.insertBefore(newResult.node, null); // Faster than appendChild

                        this._waitForChildrenToMount();
                    }
                    break;
                case DiffOperation.Update:
                    {
                        this.willUpdateCallback();

                        (this.document as HTMLElement).replaceChildren(); // Remove all the existing children

                        this.document.insertBefore(newResult.node, null);

                        //newResult.patch(this._oldResult, this.document);

                        this._waitForChildrenToUpdate();
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

                // const styleVNode = new ElementNode(
                //     'style',
                //     null,
                //     [
                //         new TextNode(styles.join(''))
                //     ]
                // );

                const styleNode = document.createElement('style');

                const styleContent = document.createTextNode(styles.join(''));

                styleNode.appendChild(styleContent);

                result = result.appendSibling(new MarkupParsingResult(/*styleVNode, */styleNode));

            }
            else { // this.shadowRoot === null

                throw Error('Not implemented');
            }

            return result;
        }

        /**
         * Wait for the children to mount before this (parent)
         */
        private async _waitForChildrenToMount() {

            const updatePromises = [...this.adoptedChildren].map(child => (child as any)._updatePromise);

            if (updatePromises.length > 0) {

                await Promise.all(updatePromises);
            }

            this.didMountCallback();
        }

        /**
         * Wait for the children to update before this (parent)
         */
        private async _waitForChildrenToUpdate() {

            const updatePromises = [...this.adoptedChildren].map(child => (child as any)._updatePromise);

            if (updatePromises.length > 0) {

                await Promise.all(updatePromises);
            }

            this.didUpdateCallback();
        }
    }

export default VirtualDomMixin;

/**
 * Wraps the array of results in a fragment node one
 * @param results 
 * @returns 
 */
function wrap(results: MarkupParsingResult[]): MarkupParsingResult {

    //const wrapperVNode = new FragmentNode(results.map(r => r.vnode) as any);

    const wrapperNode = new DocumentFragment();

    results.forEach(r => wrapperNode.insertBefore(r.node, null));

    return new MarkupParsingResult(/*wrapperVNode, */wrapperNode);
}
