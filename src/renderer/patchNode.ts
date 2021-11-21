import { createNode } from "./createNode";
import { NodePatchingData } from "./NodePatcher";

export function patchNode(node: Node, patchingData: NodePatchingData = null): void {

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

        for (let i = 0; i < oldValues.length; ++i) {

            const oldValue = oldValues[i];

            const newValue = values[i];

            if (Array.isArray(oldValue)) {

                const nonPatchingDataValues = oldValue.filter(v => v.patcher === undefined);

                if (nonPatchingDataValues.length > 0) { // The array has non patching data

                    patch(oldPatcher, rules, oldValues);
                }
                else {

                    patchChildren(oldValue, newValue);
                }
            }
            else if (oldValue === null) {

                oldPatcher.patchNode(node, rules, oldValues, values);

                ((node as any)._$patchingData).values = values; // Replace the old values with the new ones
            }
            else if (oldValue.patcher !== undefined) { // The old value is a patching data

                if (newValue === null) {

                    oldPatcher.patchNode(node, rules, oldValues, values);

                    ((node as any)._$patchingData).values = values; // Replace the old values with the new ones
                }
                else {

                    patchNode(oldValue.node, newValue);
                }
            }
            else { // The old value is NOT a patching data

                patch(oldPatcher, rules, oldValues);
            }
        }
    }

    function patch(oldPatcher: any, rules: any, oldValues: any) {

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

export function patchChildren(oldChildren: NodePatchingData[], newChildren: NodePatchingData[]) {

    let { length: oldChildrenCount } = oldChildren;

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new Map<any, Node>();

    for (let i = 0; i < oldChildrenCount; ++i) {

        const {
            node: oldChild
        } = oldChildren[i];

        if (oldChild === undefined) { // Not a patching data

            continue;
        }

        let key = (oldChild as HTMLElement).getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, oldChild);
        }
    }

    const { length: patchingDataCount } = newChildren;

    for (let i = 0; i < patchingDataCount; ++i) {

        const {
            node: oldChild
        } = oldChildren[i];

        if (oldChild === undefined) {

            const node = createNode(newChildren[i]);

            if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) { // Nested children of a child

                throw new Error('Child cannot have nested children');
            }

            //container.appendChild(node);

            throw new Error('kuku 1');
        }
        else { // oldChild !== undefined

            const newChild = newChildren[i];

            const {
                patcher,
                values
            } = newChild;

            // Check for any keyed patching data
            const {
                keyIndex
            } = patcher;

            const valueKey = keyIndex !== undefined ? values[keyIndex].toString() : null;

            // Compare against a keyed node
            const oldChildKey = (oldChild as HTMLElement).getAttribute?.('key') || null;

            if (oldChildKey === valueKey) { // If the keys are the same patch the node with that patching data    

                patchNode(oldChild, newChild);
            }
            else { // oldChildKey !== valueKey - Find the node that corresponds with the keyed patching data

                if (keyedNodes.has(valueKey)) { // Find an existing keyed node

                    const keyedNode = keyedNodes.get(valueKey);

                    patchNode(oldChild, (keyedNode as any)._$patchingData);
                }
                else { // No keyed node found, set the new child

                    patchNode(oldChild, newChild);
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= patchingDataCount; --i) {

        (oldChildren[i].node as HTMLElement).remove();
    }
}
