import { VirtualNode } from "../interfaces";
import nodeToVirtualNode from "./nodeToVirtualNode";
import parseFromString from "./parseFromString";

export default function markupToVirtualNode(
    markup: string,
    type: 'html' | 'xml' = 'xml',
    options: any = {}
): VirtualNode | string | null {

    let nodes = Array.from(parseFromString(markup, type));

    if (nodes === null) {

        return null;
    }

    if (options.excludeTextWithWhiteSpacesOnly === true) {

        nodes = nodes.filter(node => node instanceof HTMLElement ||
            node instanceof Text && !(/^\s*$/g.test((node as Text).textContent)))
    }

    return nodes.length > 1 ?
        {
            tag: null,
            attributes: null,
            children: nodes
                .map(n => nodeToVirtualNode(n, options))
                .filter(n => n !== null)
        } :
        nodeToVirtualNode(nodes[0], options);
}