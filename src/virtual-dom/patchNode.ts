// import { VirtualNode } from "./interfaces";
// //import createNode from "./dom/createNode";
// // import removeNode from "./dom/removeNode";
// // import setAttribute from "./dom/setAttribute";

// export default function patchNode(newVNode: VirtualNode, oldVNode: VirtualNode, container: Node | Document): void {

    

    

//     // if (newVNode.tag === oldVNode.tag) { // Check if the attributes and children changed

//     //     // if (newVNode.tag === null) { // It is a fragment virtual node

//     //     //     newVNode.$node = new DocumentFragment();

//     //     //     newVNode.children.forEach(child => {
                
//     //     //         newVNode.$node.appendChild(child.$node);
//     //     //     });

//     //     //     (container as any).innerHTML = '';

//     //     //     container.appendChild(newVNode.$node);
//     //     // }
//     //     // else {

//     //     //     throw 'Not implemented';
//     //     // }

//     //     // patchAttributes(element as HTMLElement, newVNode.attributes || {}, oldVNode.attributes || {});

//     //     // patchChildren(element, newVNode.children, oldVNode.children);
//     // }
//     // else { // Different tags, replace the element

//     //     const element = oldVNode.$node;

//     //     const newElement = createNode(newVNode);

//     //     element.parentNode.replaceChild(newElement, element);
//     // }
// }

// // function patchAttributes(element: HTMLElement, newAttributes: Record<string, any> = {}, oldAttributes: Record<string, any> = {}) {

// //     const mergedAttributes = Object.assign({}, oldAttributes, newAttributes);

// //     for (const [key, value] of Object.entries(mergedAttributes)) {

// //         if (newAttributes[key] === undefined) { // Remove the members that are not in the new attributes

// //             element.removeAttribute(key);
// //         }
// //         else if (oldAttributes[key] !== value) { // Update the value

// //             setAttribute(element, key, value);
// //         }
// //     }
// // }

// // function patchChildren(element: Node, newChildren: any[] = [], oldChildren: any[] = []) {

// //     newChildren.forEach((newChild, i) => {

// //         patchNode(newChild, oldChildren[i], element.childNodes[i])
// //     });

// //     const newChildrenLength = newChildren.length;

// //     // Remove the remaining children if any
// //     for (let i = oldChildren.length - 1; i >= newChildrenLength; --i) {

// //         removeNode(oldChildren[i]);
// //     }
// // }