import { NodePatchingData } from "./NodePatcher"
import { patchNode } from "./patchNode";

export function updateChildren(container: DocumentFragment | HTMLElement, oldPatchingData: NodePatchingData[], newPatchingData: NodePatchingData[]) {

    // const {
    //     length
    // } = newPatchingData;

    // oldPatchingData = oldPatchingData || [];

    // for (let i = 0; i < length; ++i) {

    //     updateNode(container, oldPatchingData[i], newPatchingData[i]);
    // }

    throw new Error('Not implemented')
}

export function updateNode(container: DocumentFragment | HTMLElement, oldPatchingData: NodePatchingData, newPatchingData: NodePatchingData) {

    let {
        node
    } = oldPatchingData;

    if (node === undefined) {
        
        console.log('kuku');
    }

    node = node !== undefined ? node : (container as ShadowRoot).host;

    patchNode(node, newPatchingData);
}