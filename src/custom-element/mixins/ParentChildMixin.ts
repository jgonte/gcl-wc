/**
 * Establishes a relationship between a parent custom element and its children to
 * allow the parent to manage them
 * @param Base 
 * @returns 
 */
const ParentChildMixin = Base =>

    class ParentChild extends Base {

        static readonly _isCustomElement: boolean = true;

        private _adoptingParent = null;

        /**
         * The children elements of this one
         */
        protected adoptedChildren: Set<Node> = new Set<Node>();

        connectedCallback() {

            super.connectedCallback?.();

            (this.adoptingParent as any)?.adoptedChildren.add(this); // It might be null for the topmost custom element
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            (this.adoptingParent as any)?.adoptedChildren.delete(this); // It might be null for the topmost custom element
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

export default ParentChildMixin;