import { EventHandler } from "./interfaces";
import ElementNode from "./nodes/ElementNode";
import MarkupParsingResult from "./MarkupParsingResult";
import markupToVirtualNode from "./markupToVirtualNode";
import { isBlankOrWhiteSpace } from "../utils/string";

/**
 * Template tag to generate the virtual node from the string
 */
export default function html(strings: TemplateStringsArray, ...values: any): MarkupParsingResult {

    const parts: MarkupParsingResult[] = [];

    const eventHandlers: EventHandler[] = [];

    const markup = processMarkup(strings, values, parts, eventHandlers);

    const result = markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true });

    let node = result.node as Node;

    const vnode = result.vnode as ElementNode;

    if (parts.length > 0) {

        // const comments = node.childNodes !== undefined ?
        //     Array.from(node.childNodes)
        //         .filter(n => n.nodeType === Node.COMMENT_NODE) :
        //     [];

        const comments = getAllComments(node.childNodes);

        parts.forEach((part, i) => {

            const partNode = part.node as Node;

            // Add as a child of the vnode
            vnode.children.push(part.vnode as any);

            // const comment = comments.length > i ?
            //     comments[i] :
            //     undefined;

            // if (comment !== undefined) { // Prepend its DOM node to the next comment placeholder of the dom node

            //     node.insertBefore(partNode, comment);
            // }
            // else { // Add the part and the marker

            //     node.insertBefore(partNode, null);

            //     node.insertBefore(new Comment(), null);
            // }

            const comment = comments[i];
            
            comment.parentNode.insertBefore(partNode, comment);
        });
    }

    if (eventHandlers.length > 0) {

        eventHandlers.forEach(eh => node.addEventListener(eh.name, eh.handler));
    }

    return result;
}

function processMarkup(strings: TemplateStringsArray, values: any, parts: any[], eventHandlers: EventHandler[]) {

    const markupParts: string[] = [];

    const length = values.length;

    for (let i = 0; i < length; ++i) {

        const markupPart = processMarkupPart(
            strings !== undefined ? strings[i] : '',
            values[i],
            parts,
            eventHandlers);

        if (!isBlankOrWhiteSpace(markupPart)) {

            markupParts.push(markupPart);
        }
    }

    if (strings !== undefined) {

        markupParts.push(strings[length]); // Add the last string
    }

    return markupParts.join('');
}

function processMarkupPart(leftSide: string, value: any, parts: any[], eventHandlers: EventHandler[]): string {

    if (value === undefined ||
        value === null ||
        value === '') {

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

    if (Array.isArray(value) && isMarkupParsingResult(value[0])) { // Recurse for every item of the array

        return processMarkup(undefined, value, parts, eventHandlers);
    }

    if (isMarkupParsingResult(value)) { // Handle virtual nodes

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
 * Removes the rightmost member of a string
 * Assumes that it always has the = operator
 */
function removeRightMember(str: string): string {

    let lastSpace = str.lastIndexOf(' ');

    if (lastSpace == -1) {

        lastSpace = 0;
    }

    return str.substring(lastSpace, str.lastIndexOf(str));
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

function isMarkupParsingResult(value: any) {

    const type = typeof value;

    if (type === 'string' ||
        type === 'number') {

        return false;
    }

    return ('vnode' in value &&
        'node' in value);
}

function getAllComments(childNodes: NodeListOf<ChildNode>) : Comment[] {

    let comments = [];

    if (childNodes === undefined) {

        return comments;
    }

    childNodes.forEach(childNode => {
        
        if (childNode.nodeType === Node.COMMENT_NODE) {

            comments.push(childNode);
        }

        if (childNode.childNodes.length > 0) {

            comments = [...comments, ...getAllComments(childNode.childNodes)];
        }  
    });

    return comments;
}

