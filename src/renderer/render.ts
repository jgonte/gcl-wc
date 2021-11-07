import { createNode } from "./createNode";
import { patchNode } from "./patchNode";
import { NodePatchingData } from "./NodePatcher";

/**
 * Renders a node
 * @param container The container where the node will be inserted if created 
 * @param node The node to render
 * @param patchingData The changes to apply to the node
 */
export function render(container: DocumentFragment | HTMLElement, node: Node = null, patchingData: NodePatchingData = null): void {

    if (Array.isArray(patchingData)) { // Collection of children

        patchChildren(container, node, patchingData);
    }
    else { // One child

        if (node === null) {

            const node = createNode(patchingData);

            container.appendChild(node);

            // If the node is a document fragment then transfer its patching data to the container
            if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {

                (container as any)._$patchingData = (node as any)._$patchingData;
            }     
        }
        else {

            patchNode(/*container,*/ node, patchingData);
        }

    }
}

function patchChildren(container: DocumentFragment | HTMLElement, node: Node, patchingData: NodePatchingData[]) {

    const oldChildren = container.childNodes;

    let { length: oldChildrenCount } = oldChildren;

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new Map<any, Node>();

    for (let i = 0; i < oldChildrenCount; ++i) {

        const oldChild = oldChildren[i] as HTMLElement;

        let key = oldChild.getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, oldChild);
        }
    }

    const { length: patchingDataCount } = patchingData;

    for (let i = 0; i < patchingDataCount; ++i) {

        const oldChild = oldChildren[i] as HTMLElement;

        if (oldChild === undefined) {

            const node = createNode(patchingData[i]);

            if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) { // Nested children of a child

                throw new Error('Child cannot have nested children');
            }

            container.appendChild(node);
        }
        else { // oldChild !== undefined

            const {
                patcher,
                values
            } = patchingData[i];

            // Check for any keyed patching data
            const {
                keyIndex
            } = patcher;

            const valueKey = keyIndex !== undefined ? values[keyIndex].toString() : null;

            // Compare against a keyed node
            const oldChildKey = oldChild.getAttribute?.('key') || null;

            if (oldChildKey === valueKey) { // If the keys are the same patch the node with that patching data    

                const {
                    patcher: oldPatcher,
                    values: oldValues,
                    rules
                } = (oldChild as any)._$patchingData;

                if (oldPatcher === patcher) {

                    oldPatcher.patchNode(oldChild, rules, oldValues, values);

                    patchingData[i].rules = rules; // Transfer the compiled rules

                    (oldChild as any)._$patchingData = patchingData[i]; // Replace the old patching data with the new one
                }
                else {

                    throw new Error('Not implemented');
                }
            }
            else { // oldChildKey !== valueKey - Find the node that corresponds with the keyed patching data

                if (keyedNodes.has(valueKey)) { // Find an existing keyed node

                    const keyedNode = keyedNodes.get(valueKey);

                    const {
                        patcher: oldPatcher,
                        values: oldValues,
                        rules
                    } = (keyedNode as any)._$patchingData;

                    if (oldPatcher === patcher) {

                        oldPatcher.patchNode(keyedNode, rules, oldValues, values);

                        patchingData[i].rules = rules; // Transfer the compiled rules

                        (keyedNode as any)._$patchingData = patchingData[i]; // Replace the old patching data with the new one
                    }
                    else {

                        throw new Error('Not implemented');
                    }

                    const {
                        parentNode
                    } = keyedNode;

                    parentNode.replaceChild(keyedNode, oldChildren[i]);
                }
                else { // No keyed node found, set the new child

                    const {
                        patcher: oldPatcher,
                        values: oldValues,
                        rules
                    } = (oldChild as any)._$patchingData;

                    if (oldPatcher === patcher) {

                        oldPatcher.patchNode(oldChild, rules, oldValues, values);

                        patchingData[i].rules = rules; // Transfer the compiled rules

                        (oldChild as any)._$patchingData = patchingData[i]; // Replace the old patching data with the new one
                    }
                    else {

                        throw new Error('Not implemented');
                    }
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= patchingDataCount; --i) {

        oldChildren[i].remove();
    }

}