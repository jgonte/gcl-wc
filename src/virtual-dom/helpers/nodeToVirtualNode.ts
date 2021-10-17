// import { EMPTY_ARRAY, EMPTY_OBJECT } from "../../utils/shared";
// import { isBlankOrWhiteSpace } from "../../utils/string";
// import ElementNode from "../nodes/ElementNode";
// import TextNode from "../nodes/TextNode";

// /**
//  * Creates a virtual node form a DOM one
//  * Removes any white space text node from the element if any bedore creating the virtual node
//  * @param node 
//  * @param options 
//  * @returns 
//  */
// export default function nodeToVirtualNode(node?: Node, options: any = {}): ElementNode | TextNode | null {

//     if (node === null) {

//         return null;
//     }

//     if (node instanceof HTMLElement) {

//         const tag = node.nodeName.toLowerCase();

//         if (tag === 'script' && !options.allowScripts) {

//             throw Error('Script elements are not allowed unless the allowScripts option is set to true');
//         }

//         // Remove any child text node with white spaces only from the node
//         node.childNodes.forEach(n => {

//             if (n instanceof Text && isBlankOrWhiteSpace((n as Text).textContent)) {

//                 node.removeChild(n);
//             }
//         });

//         return new ElementNode(
//             tag,
//             getAttributes(node.attributes),
//             getChildren(node.childNodes, options)
//         );
//     }
//     else if (node instanceof Text) {

//         const content = node.textContent || '';

//         // Do not include text with white space characters ' ', '\t', '\r', '\n'
//         if (options.excludeTextWithWhiteSpacesOnly && 
//             isBlankOrWhiteSpace(content)) {

//             return null;
//         }

//         return new TextNode(content);
//     }
//     else { // Ignore comments, also we don't expect converting from fragment documents

//         return null;
//     }
// }

// function getAttributes(attributes: NamedNodeMap) : Record<PropertyKey, any> {

//     if (attributes === null) {

//         return EMPTY_OBJECT;
//     }

//     const count = attributes.length;

//     if (count == 0) {

//         return null;
//     }

//     const props = {};

//     for (let i = 0; i < attributes.length; i++) {

//         const { name, value } = attributes[i];

//         (props as any)[name] = value;
//     }

//     return props;
// }

// function getChildren(childNodes: NodeListOf<ChildNode>, options: any): (ElementNode | TextNode)[] {

//     if (childNodes === undefined) {

//         return EMPTY_ARRAY;
//     }

//     var vnodes: (ElementNode | TextNode)[] = [];

//     childNodes.forEach(childNode => {

//         const vnode = nodeToVirtualNode(childNode, options);

//         if (vnode != null) {

//             vnodes.push(vnode);
//         }
//     });

//     return vnodes;
// }

