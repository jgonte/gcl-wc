import { createNode } from "./createNode";
import { NodePatchingData } from "./NodePatcher";

export function patchNode(node: Node, patchingData: NodePatchingData) : void {

    // container: HTMLElement | DocumentFragment, 
    const {
        patcher,
        values
    } = patchingData;

    if ((node as any)._$patchingData !== undefined) { // Patch this node

        const {
            patcher: oldPatcher,
            values: oldValues,
            rules
        } = (node as any)._$patchingData;

        if (oldPatcher === patcher) {

            oldPatcher.patchNode(node, rules, oldValues, values);

            ((node as any)._$patchingData).values = values; // Replace the old values with the new ones

            patchingData.node = node; // Set the node in the new patching data
        }
        else { // Different type of node, replace it with a new one

            const newNode = createNode(patchingData);

            const {
                parentNode
            } = node;

            parentNode.replaceChild(newNode, node);
        }
    }
}