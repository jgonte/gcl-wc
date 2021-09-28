import markupToVirtualNode from "./markupToVirtualNode";
import { EventHandler, VirtualNode } from "./interfaces";
import { EMPTY_STRING } from "../utils/shared";

/**
 * Template tag to generate the virtual node from the string
 */
export default function html(strings: TemplateStringsArray, ...values: any): VirtualNode | string | null {

    const parts = [];

    const eventHandlers: EventHandler[] = [];

    const markup = values.reduce(
        (acc, val, idx) => [...acc, stringify(strings[idx], val, parts, eventHandlers), removeEventCall(strings[idx + 1])],
        [removeEventCall(strings[0])]
    ).join('');

    const vnode = markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true });

    if (parts.length > 0) {

        let node = (vnode as VirtualNode).$node;

        if (node === undefined) {

            node = new DocumentFragment();

            (vnode as VirtualNode).$node = node;
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

    if (eventHandlers.length > 0) {

        const node = (vnode as VirtualNode).$node;

        eventHandlers.forEach(eh => node.addEventListener(eh.name, eh.handler));
    }

    return vnode;
}

function stringify(leftSide: string, value, parts, eventHandlers) {

    if (value === null ||
        value === EMPTY_STRING) {

        return EMPTY_STRING;
    }

    if (Array.isArray(value) && isVirtualNode(value[0])) { // Recurse for every item of the array

        return value.reduce((acc, val, i) => acc = [...acc, stringify(leftSide, val, parts, eventHandlers)], [])
            .join('')
    }

    if (isVirtualNode(value)) { // Handle virtual nodes

        parts.push(value);

        return '<!---->';

        //return createMarkup(value as VirtualNode);
    }

    if (typeof value === 'function') {

        const fcnName = getFunctionName(leftSide);

        if (fcnName !== null) { // Add an event handler

            eventHandlers.push({

                name: fcnName.replace('on', ''),
                handler: value
            });
        }
        else {

            throw Error('Not implemented');

            //return stringify(value(), parts);
        }

        return EMPTY_STRING;
    }

    if (typeof value === 'object') {

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


function getFunctionName(leftSide: string) : string | null {

    const parts = leftSide.split(' ');

    for (let i = 0; i < parts.length; ++i) {

        const functionName = parts[i].trim().toLocaleLowerCase();

        if (functionName[0] === 'o' && functionName[1] === 'n') {

            return functionName.replace('=', '');
        }   
    }

    return null;
}

function removeEventCall(str: string): string {

    const parts = str.split(' ');

    const newParts = [];

    for (let i = 0; i < parts.length; ++i) {

        const part = parts[i];

        const normalizedPart = part.trim().toLocaleLowerCase();

        if (normalizedPart[0] !== 'o' || normalizedPart[1] !== 'n') { // Not an event handler

            newParts.push(part);
        }   
    }

    return newParts.join(' ');
}
// function createMarkup(vnode: VirtualNode) {

//     const type = typeof vnode;

//     // If primitives, then return them
//     if (type === 'string' ||
//         type === 'number') {

//         return vnode;
//     }

//     const {
//         tag
//     } = vnode;

//     if (tag !== null) { // HTML element

//         return `<${vnode.tag} ${renderAttributes(vnode)}>${renderChildren(vnode)}</${vnode.tag}>`;
//     }
//     else { // Document fragment

//         return renderChildren(vnode);
//     }
// }

// function renderAttributes(vnode: VirtualNode) {

//     const attributes = [];

//     if (vnode.attributes === null) {

//         return EMPTY_STRING;
//     }

//     for (const [key, value] of Object.entries(vnode.attributes)) {

//         attributes.push(`${key}="${value}"`);
//     }

//     return attributes.join(' ');
// }

// function renderChildren(vnode: VirtualNode) {

//     return vnode.children.reduce(
//         (acc, child) => [...acc, createMarkup(child)],
//         []
//     ).join('');
// }


