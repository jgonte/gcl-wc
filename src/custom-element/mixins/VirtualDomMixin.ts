import { VirtualNode, DiffOperation, LifecycleHooks } from "../../virtual-dom/interfaces";
import createNode from "../../virtual-dom/dom/createNode";
import patchNode from "../../virtual-dom/dom/patchNode";
import removeChildren from "../../virtual-dom/dom/removeChildren";

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

        /**
         * The set of children nodes that are removed every time of one them gets mounted/updated to
         * allow to call the respective callback after in the parent after the children have been mounted/updated
         */
        private _childrenToUpdate: Set<Node> = undefined;

        protected updateDom() {

            let newVNode = this.render();

            // Modify the original render if needed
            newVNode = this.beforeRender(newVNode);

            const operation = this._getOperation(newVNode);

            switch (operation) {
                case DiffOperation.None: return; // Nothing to do
                case DiffOperation.Mount:
                    {
                        this.willMount();

                        this.document.insertBefore(createNode(newVNode), null); // Faster than appendChild

                        this.didMount(); // Protected method to ensure the children are mounted first before calling didMountCallback on the parent
                    }
                    break;
                case DiffOperation.Update:
                    {
                        this.willUpdateCallback?.();

                        this.willUpdate();

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

        beforeRender(newVNode: VirtualNode | VirtualNode[]): VirtualNode | VirtualNode[] {

            const styles = (this.constructor as any).metadata.styles;

            if (styles.length > 0) { // Add a style element to the node

                return this.addStyles(newVNode, styles);
            }

            return newVNode;
        }

        addStyles(newVNode: VirtualNode | VirtualNode[], styles: string[]) {

            if (this.shadowRoot !== null) {

                const styleNode: VirtualNode = {
                    tag: 'style',
                    attributes: null,
                    children: [styles.join('')]
                };

                styleNode.$node = createNode(styleNode);

                if (Array.isArray(newVNode)) {

                    newVNode = {
                        tag: null,
                        attributes: null,
                        children: [...newVNode, styleNode]
                    };
                }
                else {

                    if (newVNode.tag === null) { // It is a fragment node

                        newVNode.children.push(styleNode); // Add it to the fragment

                        if (newVNode.$node !== undefined) {

                            newVNode.$node.appendChild(styleNode.$node);
                        }
                    }
                    else { // Wrap it in a fragment
    
                        newVNode = {
                            tag: null,
                            attributes: null,
                            children: [newVNode, styleNode]
                        };
                    }
                }         
            }

            return newVNode;
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