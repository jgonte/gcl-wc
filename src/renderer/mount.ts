import { createNode } from "./createNode";
import { NodePatchingData } from "./NodePatcher";

export function mountChildren(container: Node, patchingData: NodePatchingData[]) {

    const {
        length
    } = patchingData;

    for (let i = 0; i < length; ++i) {

        mountNode(container, patchingData[i]);
    }
}

export function mountNode(container: Node, patchingData: NodePatchingData) {

    const node = createNode(container, patchingData);

    container.appendChild(node);
}