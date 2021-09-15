import { VirtualNode } from "../interfaces";

const svgElements = ['svg', 'use', 'symbol', 'path', 'g', 'defs', 'title'];

/**
 * Creates the DOM element from the virtual node
 * @param vnode The virtual node to create the element from
 */
export function createDomElement(vnode: VirtualNode | string) {

    if (typeof vnode === 'string') {

        return document.createTextNode(vnode);
    }

    const {
        tag,
        attributes,
        children
    } = vnode;

    let node = null;

    //let isSvg = false;

    // Create the element
    if (svgElements.includes(tag) === true) {

        node = document.createElementNS('http://www.w3.org/2000/svg', tag);

        //isSvg = true;

    } else {

        node = document.createElement(tag);
    }

    for (let name in Object(attributes)) {

        if (name in node) { // There is a setter defined in the element

            node[name] = attributes[name];
        }
        else {

            node.setAttribute(name, attributes[name]);
        }
    }

    for (let i = 0; i < children.length; ++i) {

        node.appendChild(createDomElement(children[i]));
    }

    vnode.$node = node;

    (node as any)._vnode = vnode;

    return node;
}