/**
 * Mixin for the child element to attach itself to the children collection of the parent element
 * So the parent can manage is children
 * @param Base 
 * @returns 
 */
const ChildMixin = Base =>

    class Child extends Base {

        static readonly _isCustomElement: boolean = true;

        connectedCallback(node: Node) {

            super.connectedCallback?.(node);

            (this.getParent() as any)?.addAdoptedChild(this); // It might be null for the topmost custom element
        }
    
        disconnectedCallback(node: Node) {
    
            super.disconnectedCallback?.(node);

            (this.getParent() as any)?.removeAdoptedChild(this); // It might be null for the topmost custom element
        }

        protected getParent() : Node {

            let parent = this.parentNode;

            while (parent !== null) {

                if (parent.constructor._isCustomElement) {  // It is one of our custom elements

                    break;
                }

                parent = parent.parentNode;
            }

            return parent;
        }
    }

export default ChildMixin;