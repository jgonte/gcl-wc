import { VirtualNode } from "../../interfaces";
import createNode from "./createNode";

export default function patchNode(newVNode: VirtualNode, oldVNode: VirtualNode, document: Document): Node {

    
    const oldElement = oldVNode.$node;

    if (newVNode.tag === oldVNode.tag) { // Check if the attributes and children changed

        return oldElement;

    }
    else { // Different tags, replace the element

        const newElement = createNode(newVNode);

        oldElement.parentNode.replaceChild(newElement, oldElement);

        return newElement;
    }

}