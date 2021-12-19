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

            const {
                adoptingParent
            } = this;

            if (adoptingParent === null) { // In slotted elements the parent is null when connected

                return;
            }

            (adoptingParent as any).adoptedChildren.add(this); // It might be null for the topmost custom element

            this.didAdoptChildCallback?.(adoptingParent, this);
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            const {
                adoptingParent
            } = this;

            if (adoptingParent === null) {

                return;
            }

            this.willAbandonChildCallback?.(adoptingParent, this);

            (adoptingParent as any).adoptedChildren.delete(this); // It might be null for the topmost custom element
        }

        didMountCallback() {

            super.didMountCallback?.();

            // Add the slotted children
            const slot = this.document.querySelector('slot');

            if (slot === null) { // There is no slot to get the children from

                const {
                    adoptingParent
                } = this;

                if (adoptingParent !== null) {

                    (adoptingParent as any).adoptedChildren.add(this); // It might be null for the topmost custom element

                    this.didAdoptChildCallback?.(adoptingParent, this);

                    return; 
                }               
            }

            const children = slot.assignedElements();

            if (children.length > 0) { // The children have been already loaded

                children.forEach(child => {
                    
                    this.adoptedChildren.add(child);

                    this.didAdoptChildCallback?.(this, child);
                });
            }
            else { // Listen for any change in the slot

                slot.addEventListener('slotchange', this.handleSlotChange);
            }

            const {
                adoptedChildren
            } = this;

            if (adoptedChildren.size > 0) {

                this.didAdoptChildrenCallback?.(this, adoptedChildren);
            }
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