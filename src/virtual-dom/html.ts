import markupToVirtualNode from "./markupToVirtualNode";
import { VirtualNode, VirtualNodePart } from "./interfaces";
import { EMPTY_STRING } from "../utils/shared";

/**
 * Template tag to generate the virtual node from the string
 */
export default function html(strings: TemplateStringsArray, ...values: any): VirtualNode | VirtualNodePart | string | null {

    const parts = [];

    const markup = values.reduce(
        (acc, val, idx) => [...acc, stringify(val, parts), strings[idx + 1]],
        [strings[0]]
    ).join('');

    const vnode = markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true });

    if (parts.length > 0) {

        let node = (vnode as VirtualNode).$node;

        if (node === undefined) {

            node = new DocumentFragment();
        }

        const comments = Array.from(node.childNodes)
            .filter(n => n.nodeType === Node.COMMENT_NODE);

        parts.forEach((part, i) => {

            // Add as a child of the vnode
            (vnode as VirtualNode).children.push(part);

            const comment = comments.length > i ?
                comments[i] :
                undefined;

            if (comment !== undefined) { // Prepend its DOM node to the next comment placeholder of the dom node

                node.insertBefore(part.$node, comment);
            }
            else { // Add the part and the marker

                node.appendChild(part.$node);

                node.appendChild(new Comment());
            }
        });
    }

    return vnode;
}

function stringify(value, parts) {

    if (Array.isArray(value) && isVirtualNode(value[0])) { // Recurse for every item of the array

        return value.reduce((acc, val, i) => acc = [...acc, stringify(val, parts)], [])
            .join('')
    }
    if (isVirtualNode(value)) { // Handle virtual nodes

        parts.push(value);

        return '<!---->';

        //return createMarkup(value as VirtualNode);
    }
    else if (typeof value === 'function') {

        return stringify(value(), parts);
    }
    else if (typeof value === 'object') {

        return JSON.stringify(value);
    }

    return value;
}

function isVirtualNode(value: any) {

    const type = typeof value;

    // Exclude primitives
    if (type === 'string' ||
        type === 'number') {

        return false;
    }

    return ('tag' in value &&
        'attributes' in value &&
        'children' in value);
}

function createMarkup(vnode: VirtualNode) {

    const type = typeof vnode;

    // If primitives, then return them
    if (type === 'string' ||
        type === 'number') {

        return vnode;
    }

    const {
        tag
    } = vnode;

    if (tag !== null) { // HTML element

        return `<${vnode.tag} ${renderAttributes(vnode)}>${renderChildren(vnode)}</${vnode.tag}>`;
    }
    else { // Document fragment

        return renderChildren(vnode);
    }
}

function renderAttributes(vnode: VirtualNode) {

    const attributes = [];

    if (vnode.attributes === null) {

        return EMPTY_STRING;
    }

    for (const [key, value] of Object.entries(vnode.attributes)) {

        attributes.push(`${key}="${value}"`);
    }

    return attributes.join(' ');
}

function renderChildren(vnode: VirtualNode) {

    return vnode.children.reduce(
        (acc, child) => [...acc, createMarkup(child)],
        []
    ).join('');
}


