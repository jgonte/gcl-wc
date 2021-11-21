import { createNode } from "./createNode";
import { NodePatcher, NodePatchingData } from "./NodePatcher";
import { patchNode } from "./patchNode";



// interface NodePatchingDataHolder {

//     _$patchingData: NodePatchingData
// }










// function appendChildren(markerNode: Node, newChildren: any) {

//     const { parentNode } = markerNode;

//     if (isPrimitive(newChildren)) {

//         const newChild = document.createTextNode(newChildren.toString());

//         parentNode.insertBefore(newChild, markerNode);
//     }
//     else {

//         const { length } = newChildren;

//         for (let i = 0; i < length; ++i) {

//             let newChild = newChildren[i];

//             if (isPrimitive(newChild)) {

//                 newChild = document.createTextNode(newChild.toString());
//             }

//             parentNode.insertBefore(newChild, markerNode);
//         }
//     }
// }

export function render(container: DocumentFragment | HTMLElement,
    oldPatchingData: NodePatchingData | NodePatchingData[] = null,
    newPatchingData: NodePatchingData | NodePatchingData[] = null) {

    if (oldPatchingData === null
        && newPatchingData === null) {

        return; // Nothing to patch
    }

    if (Array.isArray(newPatchingData)) {

        renderChildren(container, oldPatchingData as NodePatchingData[], newPatchingData);
    }
    else {

        renderNode(container, oldPatchingData as NodePatchingData, newPatchingData);
    }
}

function renderChildren(container: DocumentFragment | HTMLElement,
    oldPatchingData: NodePatchingData[],
    newPatchingData: NodePatchingData[]) {

    const {
        length
    } = newPatchingData;

    oldPatchingData = oldPatchingData || [];

    for (let i = 0; i < length; ++i) {

        renderNode(container, oldPatchingData[i], newPatchingData[i]);
    }
}

function renderNode(container: DocumentFragment | HTMLElement,
    oldPatchingData: NodePatchingData = null,
    newPatchingData: NodePatchingData = null) {

    if (oldPatchingData === null) { // Create a node from the new patching data and add the children to the container

        const node = createNode(newPatchingData);

        container.appendChild(node);

        newPatchingData.node = node;

        //newPatchingData.rules = rules;
    }
    else if (newPatchingData === null) { // Remove the children from the container

        throw new Error('render newPatchingData === null is not implemented')
    }
    else { // oldPatchingData !== null && newPatchingData !== null - Patch the old node/nodes

        let {
            node
        } = oldPatchingData;

        node = node !== undefined ? node : container;

        patchNode(node, newPatchingData);
    }
}

const cache = new Map<string, NodePatcher>();

export function html(strings: TemplateStringsArray, ...values: any): NodePatchingData {

    const key = strings.toString();

    let patcher = cache.get(key);

    if (patcher === undefined) {

        patcher = new NodePatcher(strings);

        cache.set(key, patcher);
    }

    // Return a new patching data with the shared patcher
    return {
        patcher,
        rules: null,
        values
    };
}