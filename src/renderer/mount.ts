import { createNode } from "./createNode";
import { NodePatchingData } from "./NodePatcher";

export function mountChildren(container: DocumentFragment | HTMLElement,  patchingData: NodePatchingData[]) {

    const {
        length
    } = patchingData;

    for (let i = 0; i < length; ++i) {

        mountNode(container, patchingData[i]);
    }
}

export function mountNode(container: DocumentFragment | HTMLElement,  patchingData: NodePatchingData) {

    const node = createNode(/*container,*/ patchingData);

    container.appendChild(node);
}