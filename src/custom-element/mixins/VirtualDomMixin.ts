import { VirtualNode } from "../../virtual-dom/interfaces";
import render from "../../virtual-dom/render";

/**
 * Updates the element using a virtual DOM approach
 * @param Base 
 * @returns 
 */
const VirtualDomMixin = Base =>

    class VirtualDom extends Base {

        /**
         * The old virtual node to diff against
         */
        private _oldVNode: VirtualNode = undefined;

        protected doUpdate() {

            const newVNode = this.render();

            render(
                newVNode,
                this._oldVNode,
                this.document
            );

            this._oldVNode = newVNode;
        }
    }

export default VirtualDomMixin;