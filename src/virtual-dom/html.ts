import markupToVirtualNode from "./markupToVirtualNode";
import { EventHandler, VirtualNode } from "./interfaces";

/**
 * Template tag to generate the virtual node from the string
 */
export default function html(strings: TemplateStringsArray, ...values: any): VirtualNode | string | null {

    const parts = [];

    const eventHandlers: EventHandler[] = [];

    const markup = processMarkup(strings, values, parts, eventHandlers);

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

function processMarkup(strings: TemplateStringsArray, values: any, parts: any[], eventHandlers: EventHandler[]) {

    const markupParts: string[] = [];

    const length = values.length;

    for (let i = 0; i < length; ++i) {

        markupParts.push(
            processMarkupPart(
                strings !== undefined ? strings[i] : '',
                values[i],
                parts,
                eventHandlers)
        );
    }

    if (strings !== undefined) {

        markupParts.push(strings[length]); // Add the last string
    }

    return markupParts.join('');
}

function processMarkupPart(leftSide: string, value: any, parts: any[], eventHandlers: EventHandler[]): string {

    if (value === undefined) {

        return removeRightMember(leftSide);
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
        }

        return removeRightMember(leftSide);
    }

    if (Array.isArray(value) && isVirtualNode(value[0])) { // Recurse for every item of the array

        return processMarkup(undefined, value, parts, eventHandlers);
    }

    if (isVirtualNode(value)) { // Handle virtual nodes

        parts.push(value);

        return `${leftSide}<!---->`; // Set the placeholder
    }

    if (typeof value === 'object') {

        if (leftSide.endsWith('=')) { // It is an attribute

            return `${leftSide}'${JSON.stringify(value)}'`;
        }
        else { // It is a text node

            return JSON.stringify(value); // Show the raw data
        }
    }

    // A primitive type
    if (leftSide.endsWith('=')) { // It is an attribute

        return `${leftSide}"${value}"`;
    }
    else { // It is a text node

        return `${leftSide}${value}`;
    }
}

/**
 * Removes the rightmost member of a string if it has the equal operator
 */
function removeRightMember(str: string): string {

    if (str.endsWith('=')) { // It is an attribute ... remove it

        let lastSpace = str.lastIndexOf(' ');

        if (lastSpace == -1) {

            lastSpace = 0;
        }

        return str.substring(lastSpace, str.lastIndexOf(str));
    }
    else {

        return str; // Nothing to remove
    }
}

function getFunctionName(leftSide: string): string | null {

    const parts = leftSide.split(' ');

    for (let i = 0; i < parts.length; ++i) {

        const functionName = parts[i].trim().toLocaleLowerCase();

        if (functionName[0] === 'o' && functionName[1] === 'n') {

            return functionName.replace('=', '');
        }
    }

    return null;
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
