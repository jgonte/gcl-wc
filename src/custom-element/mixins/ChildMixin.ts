/**
 * Mixin for the child element to attach itself to the children collection of the parent element
 * So the parent can manage is children
 * @param Base 
 * @returns 
 */
const ChildMixin = Base =>

    class Child extends Base {

        static readonly _isCustomElement: boolean = true;

        private _adoptingParent = null;

        connectedCallback(node: Node) {

            super.connectedCallback?.(node);

            (this.adoptingParent as any)?.addAdoptedChild(this); // It might be null for the topmost custom element
        }

        disconnectedCallback(node: Node) {

            super.disconnectedCallback?.(node);

            (this.adoptingParent as any)?.removeAdoptedChild(this); // It might be null for the topmost custom element
        }

        protected get adoptingParent(): Node {

            if (this._adoptingParent === null) {

                let parent = this.parentNode;

                while (parent !== null) {

                    if (parent.constructor._isCustomElement) {  // It is a custom element

                        break;
                    }

                    parent = parent.parentNode;
                }

                this._adoptingParent = parent;
            }

            return this._adoptingParent;
        }
    }

export default ChildMixin;