import FragmentNode from "./nodes/FragmentNode";
import parseFromString from "./helpers/parseFromString";
import nodeToVirtualNode from "./helpers/nodeToVirtualNode";
import MarkupParsingResult from "./MarkupParsingResult";

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
): MarkupParsingResult {

    let nodes = Array.from(parseFromString(markup, type));

    if (nodes === null) {

        return null;
    }

    if (options.excludeTextWithWhiteSpacesOnly === true) {

        nodes = nodes.filter(node => node instanceof HTMLElement ||
            node instanceof Comment ||
            node instanceof Text && !(/^\s*$/g.test((node as Text).textContent))) // Exclude text with white spaces
    }

    const vnode = nodes.length > 1 ?
        new FragmentNode(
            nodes.map(n => nodeToVirtualNode(n, options))
                .filter(n => n !== null)
        ) :
        nodeToVirtualNode(nodes[0], options);

    // Wrap the nodes in a fragment if more than one
    let node: Node | DocumentFragment;

    if (nodes.length > 1) {

        node = new DocumentFragment();

        for (const n of nodes) {

            node.appendChild(n);
        }
    }
    else {

        node = nodes[0];
    }

    return new MarkupParsingResult(vnode, node);
}