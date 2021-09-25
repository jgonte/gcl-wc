import { VirtualNode, VirtualNodePart } from "./interfaces";
import nodeToVirtualNode from "./helpers/nodeToVirtualNode";
import parseFromString from "./helpers/parseFromString";
import { EMPTY_OBJECT } from "../utils/shared";

/**
 * Convert a HTML markup into a virtual node
 * @param markup 
 * @param type 
 * @param options 
 * @returns 
 */
export default function markupToVirtualNode(
    markup: string,
    type: 'html' | 'xml' = 'xml',
    options: any = {}
): VirtualNode | VirtualNodePart | string | null {

    let nodes = Array.from(parseFromString(markup, type));

    if (nodes === null) {

        return null;
    }

    if (options.excludeTextWithWhiteSpacesOnly === true) {

        nodes = nodes.filter(node => node instanceof HTMLElement ||
            node instanceof Comment || // && node.data.startsWith('{{') && node.data.endsWith('}}') || // Experimental
            node instanceof Text && !(/^\s*$/g.test((node as Text).textContent)))
    }

    return nodes.length > 1 ?
        {
            tag: null,
            attributes: EMPTY_OBJECT,
            children: nodes
                .map(n => nodeToVirtualNode(n, options))
                .filter(n => n !== null)
        } :
        nodeToVirtualNode(nodes[0], options);
}