import { VirtualNode } from "../interfaces";
import createNode from "./createNode";

/**
 * Ensures the DOM node is in sync with its virtual node
 * @param vnode 
 * @param node 
 * @returns 
 */
export default function patchNode(vnode: VirtualNode, container: Node = undefined): Node {

    // if (typeof vnode === 'string') {

    //     return null;
    // }

    let node = vnode.$node;

    if (node === undefined) {

        return vnode.$node = node = createNode(vnode);
    }

    if (vnode.tag === null) { // Fragment

        // The container is needed to patch the children
        patchChildren(container, vnode.children);

        return container;
    }

    if (vnode.tag.toUpperCase() === (node as HTMLElement).tagName) { // Check if the attributes and children changed

        //patchAttributes(element as HTMLElement, vnode.attributes || {}, oldVNode.attributes || {});

        patchChildren(node, vnode.children);

        return node;

    }
    else { // Different tags, replace the element

        return vnode.$node = node = createNode(vnode);
    }

}

// function patchAttributes(element: HTMLElement, newAttributes: Record<string, any> = {}, oldAttributes: Record<string, any> = {}) {

//     for (const [key, value] of Object.entries(newAttributes)) {

//         setAttribute(element, key, value);
//     }

// }

function patchChildren(element: Node, children: VirtualNode[] = []) {

    children.forEach((child, i) => {

        const node = patchNode(child, element);

        if (node !== null) { // Not a text node

            element.appendChild(node);
        }
        
    });

    // const newChildrenLength = newChildren.length;

    // // Remove the remaining children if any
    // for (let i = children.length - 1; i >= newChildrenLength; --i) {

    //     removeNode(oldChildren[i]);
    // }
}

// function setAttribute(element: HTMLElement, key: string, value: any) {

//     element.setAttribute(key, value);
// }

