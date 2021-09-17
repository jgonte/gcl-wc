import { VirtualNode } from "../interfaces";
import nodeToVirtualNode from "./nodeToVirtualNode";
import parseFromString from "./parseFromString";

export default function markupToVirtualNode(
    markup: string, 
    type: 'html' | 'xml' = 'xml',
    options: any = {}
) : VirtualNode | string | null {

    const nodes = parseFromString(markup, type);

    if (nodes === null) {

        return null;
    }

    return nodes.length > 1 ?
        {
            tag: null,
            attributes: null,
            children: Array.from(nodes)
            .map(n => nodeToVirtualNode(n, options))
            .filter(n => n !== null)
        } :
        nodeToVirtualNode(nodes[0], options);
}