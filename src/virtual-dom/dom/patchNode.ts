import { VirtualNode } from "../interfaces";
import createNode from "./createNode";

export default function patchNode(newVNode: VirtualNode, oldVNode: VirtualNode, container: Document | HTMLElement): void {

    const oldElement = oldVNode.$node;

    if (newVNode.tag === oldVNode.tag) { // Check if the attributes and children changed

        patchAttributes(oldElement as HTMLElement, newVNode.attributes || {}, oldVNode.attributes || {});

        patchChildren(oldElement, newVNode.children, oldVNode.children);

    }
    else { // Different tags, replace the element

        const newElement = createNode(newVNode);

        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

}

function patchAttributes(element: HTMLElement, newAttributes: Record<string, any> = {}, oldAttributes: Record<string, any> = {}) {

    for (const [key, value] of Object.entries(newAttributes)) {

        setAttribute(element, key, value);
    }

}

function patchChildren(oldElement: Node, oldChildren: any[] = [], newChildren: any[] = []) {

    //throw new Error("Function not implemented.");
}

function setAttribute(element: HTMLElement, key: string, value: any) {

    element.setAttribute(key, value);
}

