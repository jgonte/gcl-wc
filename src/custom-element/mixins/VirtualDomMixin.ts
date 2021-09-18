import { VirtualNode, DiffOperation, LifecycleHooks } from "../../virtual-dom/interfaces";
import createNode from "../../virtual-dom/helpers/dom/createNode";
import patchNode from "../../virtual-dom/helpers/dom/patchNode";
import removeChildren from "../../virtual-dom/helpers/dom/removeChildren";

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
        private _oldVNode: VirtualNode = null;

        protected updateDom() {

            let newVNode = this.render();

            // Modify the original render if needed
            newVNode = this.beforeRender(newVNode);

            const operation = this._getOperation(newVNode);

            switch (operation) {
                case DiffOperation.None: return; // Nothing to do
                case DiffOperation.Mount:
                    {
                        this.document.appendChild(createNode(newVNode));

                        this.didMount(); // Protected method to ensure the children are mounted first before calling didMountCallback on the parent
                    }
                    break;
                case DiffOperation.Update:
                    {
                        this.willUpdateCallback?.();

                        patchNode(newVNode, this._oldVNode, this.document);

                        this.didUpdate(); // Protected method to ensure the children are updated first before calling didUpdateCallback on the parent
                    }
                    break;
                case DiffOperation.Unmount:
                    {
                        this.willUnmountCallback?.();

                        removeChildren(this.document);
                    }
                    break;                    
            }

            this._oldVNode = newVNode;
        }

        private _getOperation(newVNode: VirtualNode): DiffOperation {

            if (this._oldVNode === null) {

                if (newVNode === null) {

                    return DiffOperation.None;
                }
                else { // newVNode !== null

                    return DiffOperation.Mount;
                }
            }
            else { // this._oldVNode !== null

                if (newVNode === null) {

                    return DiffOperation.Unmount;
                }
                else { // newVNode !== null

                    return DiffOperation.Update;
                }
            }
        }

        beforeRender(newVNode: VirtualNode) : VirtualNode {
            
            const styles = (this.constructor as any).metadata.styles;

            if (styles.length > 0) { // Add a style element to the node

                return this.addStyles(newVNode, styles);
            }

            return newVNode;
        }

        addStyles(newVNode: VirtualNode, styles: string[]) {

            if (this.shadowRoot !== null) {

                const styleNode = {
                    tag: 'style',
                    attributes: null,
                    children: styles.join('')
                }

                if (newVNode.tag === null) { // It is a fragment node

                    newVNode.children.push(styleNode); // Add it to the fragment
                }
                else { // Wrap it in a fragment

                    newVNode = {
                        tag: null,
                        attributes: null,
                        children: [ newVNode, styleNode]
                    };
                }
            }

            return newVNode;
        }

    }

export default VirtualDomMixin;