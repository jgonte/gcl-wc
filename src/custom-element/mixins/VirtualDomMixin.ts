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

            const newVNode = this.render();

            // Modify the original render if needed
            this.beforeRender?.(newVNode);

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

    }

export default VirtualDomMixin;