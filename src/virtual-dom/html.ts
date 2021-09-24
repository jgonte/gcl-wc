import markupToVirtualNode from "./markupToVirtualNode";
import { VirtualNode, VirtualNodePart } from "./interfaces";
import { EMPTY_STRING } from "../utils/shared";

/**
 * Template tag to generate the virtual node from the string
 */
export default function html(strings: TemplateStringsArray, ...values: any): VirtualNode | VirtualNodePart | string | null {

    // const preMarkup = values.reduce(
    //     (acc, val, idx) => [...acc, `<!--{{${idx}}}-->`, strings[idx + 1]],
    //     [strings[0]]
    // ).join('');

    // console.log(preMarkup);

    const markup = values.reduce(
        (acc, val, idx) => [...acc, stringify(val), strings[idx + 1]],
        [strings[0]]
    ).join('');

    return markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true });
}

function stringify(value) {

    if (isVirtualNode(value)) { // Handle virtual nodes

        return createMarkup(value as VirtualNode);
    }
    else if (typeof value === 'function') {

        return stringify(value());
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

