import { VirtualNode } from "../interfaces";

export default function domNodeToVirtualNode(node?: Node, options: any = {}): VirtualNode | string | null {

    if (node === null) {

        return null;
    }

    if ((node! as Node).nodeType === 1) { // TODO: Find a faster way of testing that

        const element = node! as HTMLElement;

        const tag = element.nodeName.toLowerCase();

        if (tag === 'script' && !options.allowScripts) {

            throw Error('Script elements are not allowed unless the allowScripts option is set to true');
        }

        const attributes = getAttributes(element.attributes);

        const children = getChildren(element.childNodes, options);

        return {
            tag,
            attributes,
            children
        };
    }
    else if ((node! as Text).splitText !== undefined) { // text node (fast way of determining)

        const content = (node! as Text).textContent || '';

        // Do not include text with white space characters ' ', '\t', '\r', '\n'
        if (options.excludeTextWithWhiteSpacesOnly &&
            /^\s*$/g.test(content)) {

            return null;
        }

        return content;
    }
    else {

        return null;
    }
}

function getAttributes(attributes: NamedNodeMap) {

    if (attributes === null) {

        return null;
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

function getChildren(childNodes: NodeListOf<ChildNode>, options: any): (VirtualNode | string)[] {

    var vnodes: (VirtualNode | string)[] = [];

    childNodes.forEach(childNode => {

        const vnode = domNodeToVirtualNode(childNode, options);

        if (vnode != null) {

            vnodes.push(vnode);
        }
    });

    return vnodes;
}

