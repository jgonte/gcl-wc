import { EMPTY_ARRAY, EMPTY_OBJECT } from "../../utils/shared";
import { VirtualNode, VirtualNodePart } from "../interfaces";

/**
 * Creates a virtual node form a DOM one
 * @param node 
 * @param options 
 * @returns 
 */
export default function nodeToVirtualNode(node?: Node, options: any = {}): VirtualNode | VirtualNodePart | string | null {

    if (node === null) {

        return null;
    }

    if (node instanceof HTMLElement) {

        const tag = node.nodeName.toLowerCase();

        if (tag === 'script' && !options.allowScripts) {

            throw Error('Script elements are not allowed unless the allowScripts option is set to true');
        }

        const attributes = getAttributes(node.attributes);

        const children = getChildren(node.childNodes, options);

        return {
            tag,
            attributes,
            children,
            $node: node
        };
    }
    else if (node instanceof Text) {

        const content = node.textContent || '';

        // Do not include text with white space characters ' ', '\t', '\r', '\n'
        if (options.excludeTextWithWhiteSpacesOnly &&
            /^\s*$/g.test(content)) {

            return null;
        }

        return content;
    }
    else if (node instanceof Comment && node.data.startsWith('{{') && node.data.endsWith('}}')) { // Experimental

        return {
            index: parseInt(node.data.substring(2, node.data.length - 2)),
            $node: node
        };
    }
    else {

        return null;
    }
}

function getAttributes(attributes: NamedNodeMap) {

    if (attributes === null) {

        return EMPTY_OBJECT;
    }

    const count = attributes.length;

    if (count == 0) {

        return null;
    }

    const props = {};

    for (let i = 0; i < attributes.length; i++) {

        const { name, value } = attributes[i];

        // if (name.substring(0,2)==='on' && walk.options.allowEvents){
        // 	value  = new Function(value); // eslint-disable-line no-new-func
        // }

        (props as any)[name] = value;
    }

    return props;
}

function getChildren(childNodes: NodeListOf<ChildNode>, options: any): (VirtualNode | VirtualNodePart | string)[] {

    if (childNodes === undefined) {

        return EMPTY_ARRAY;
    }

    var vnodes: (VirtualNode | VirtualNodePart | string)[] = [];

    childNodes.forEach(childNode => {

        const vnode = nodeToVirtualNode(childNode, options);

        if (vnode != null) {

            vnodes.push(vnode);
        }
    });

    return vnodes;
}

