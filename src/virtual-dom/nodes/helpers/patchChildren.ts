// import ElementNode from "../ElementNode";
// import TextNode from "../TextNode";

// export default function patchChildren(container: Node, children: (ElementNode | TextNode)[]): boolean {

//     let updated: boolean = false;

//     // Map the keyed nodes from the DOM nodes
//     const childNodes = Array.from(container.childNodes);

//     const keyedNodes = new Map<any, Node>();

//     for (const node of childNodes) {

//         let key = (node as HTMLElement).getAttribute?.('key') || null;

//         if (key !== null) {

//             keyedNodes.set(key, node);
//         }
//     }

//     let domNodesCount = childNodes.length;

//     const virtualChildrenCount = children.length;

//     // Loop through the virtual children
//     for (let i = 0; i < virtualChildrenCount; ++i) {

//         const vnode = children[i]; // Get the vnode at the current index

//         const vnodeKey = (vnode as any).key || null; // Check if the virtual node has a key (set it to null to match the comparison of keys)

//         const domNode = childNodes[i]; // Get the DOM node at the current index

//         if (domNode === undefined) {

//             let newNode;

//             if (keyedNodes.has(vnodeKey)) { // Find an existing keyed node

//                 newNode = keyedNodes.get(vnodeKey);

//                 if (vnode.patchDom(newNode as any) === true) {

//                     updated = true;
//                 }

//             }
//             else {

//                 newNode = vnode.createDom();
//             }

//             container.appendChild(newNode);

//             updated = true;
//         }
//         else { // domNode !== undefined

//             const domNodeKey = (domNode as HTMLElement).getAttribute?.('key') || null; // Check if the DOM node has a key

//             if (vnodeKey === domNodeKey) {

//                 if (vnode.patchDom(domNode as any) === true) {

//                     updated = true;
//                 }
//             }
//             else { //vnodeKey !== domNodeKey

//                 let newNode;

//                 if (keyedNodes.has(vnodeKey)) { // Find an existing keyed node

//                     newNode = keyedNodes.get(vnodeKey);

//                     if (vnode.patchDom(newNode as any) === true) {

//                         updated = true;
//                     }

//                     if (domNodesCount >= virtualChildrenCount) {

//                         container.insertBefore(newNode, domNode);

//                         --domNodesCount; // The domNode is removed from the container
//                     }
//                     else {

//                         container.appendChild(newNode);

//                         --domNodesCount; // The domNode is added to the container
//                     }
//                 }
//                 else { // No keyed node found, create a new element

//                     newNode = vnode.createDom();

//                     container.insertBefore(newNode, domNode);

//                     ++domNodesCount; // Update the count of extra nodes to remove
//                 }

//                 updated = true;
//             }

//         }
//     }

//     // Remove the extra nodes
//     for (let i = domNodesCount - 1; i >= virtualChildrenCount; --i) {

//         container.childNodes[i].remove();
//     }

//     return updated;
// }