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

    const node = createNode(patchingData);

    if ((node as any)._$patchingData === undefined) { // More than one node are created

        // Set the node of the patching data
        patchingData.node = container;

        //TODO: Remove this if never happens
        if ((container as any)._$patchingData !== undefined) {

            throw new Error('Container has already patching data');
        }

        // Attach the patching data to the container
        (container as any)._$patchingData = patchingData;
    }

    container.appendChild(node);
}