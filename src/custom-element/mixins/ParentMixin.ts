/**
 * Mixin for the child element to attach itself to the children collection of the parent element
 * So the parent can manage is children
 * @param Base 
 * @returns 
 */
const ParentMixin = Base =>

    class Parent extends Base {

        private adoptedChildren: Set<Node> = new Set<Node>();

        protected addAdoptedChild(child: Node) {

            this.adoptedChildren.add(child);
        }

        protected removeAdoptedChild(child: Node) {

            this.adoptedChildren.delete(child);
        }
    }

export default ParentMixin;