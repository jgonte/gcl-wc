import areEquivalentValues from "./areEquivalentValues";
import { createNode } from "./createNode";
import { mountNode } from "./mount";
import { NodePatchingData } from "./NodePatcher"
import { patchNode } from "./patchNode";

export function updateChildren(container: Node, oldPatchingData: NodePatchingData[], newPatchingData: NodePatchingData[]) {

    let { length: oldCount } = oldPatchingData;

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new Map<any, Node>();

    for (let i = 0; i < oldCount; ++i) {

        const {
            node: oldChild
        } = oldPatchingData[i];

        if (oldChild === undefined) { // Not a patching data

            continue;
        }

        let key = (oldChild as HTMLElement).getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, oldChild);
        }
    }

    const { length: newCount } = newPatchingData;

    for (let i = 0; i < newCount; ++i) {

        const oldChild = i < oldPatchingData.length ?
            oldPatchingData[i].node :
            undefined;

        if (oldChild === undefined) { // Mount the child

            mountNode(container, newPatchingData[i]);
        }
        else { // oldChild !== undefined

            const newChildPatchingData = newPatchingData[i];

            const {
                patcher,
                values
            } = newChildPatchingData;

            // Check for any keyed patching data
            const {
                keyIndex
            } = patcher;

            const valueKey = keyIndex !== undefined ? values[keyIndex].toString() : null;

            // Compare against a keyed node
            const oldChildKey = (oldChild as HTMLElement).getAttribute?.('key') || null;

            if (oldChildKey === valueKey) { // If the keys are the same patch the node with that patching data    

                patchNode(oldChild, newChildPatchingData);
            }
            else { // oldChildKey !== valueKey - Find the node that corresponds with the keyed patching data

                if (keyedNodes.has(valueKey)) { // Find an existing keyed node

                    const keyedNode = keyedNodes.get(valueKey);

                    // If the values of the keyed node match the ones of the oldChild then just swap them
                    if (areEquivalentValues(newChildPatchingData.values, (keyedNode as any)._$patchingData.values)) {

                        if (i >= container.childNodes.length) {

                            container.appendChild(keyedNode);
                        }
                        else {

                            container.insertBefore(keyedNode, container.childNodes[i]); // Notice oldNode is not being used since its position might have changed
                        }

                        newChildPatchingData.node = keyedNode; // Set the node of the new patching data
                    }
                    else { // Some value has changed, patch the existing node

                        patchNode(oldChild, (keyedNode as any)._$patchingData);
                    }
                }
                else { // No keyed node found, set the new child

                    patchNode(oldChild, newChildPatchingData);
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldCount - 1; i >= newCount; --i) {

        (oldPatchingData[i].node as HTMLElement).remove();
    }
}

export function updateNode(container: Node, oldPatchingData: NodePatchingData, newPatchingData: NodePatchingData) {

    let {
        node
    } = oldPatchingData;

    if (node === undefined) {

        throw new Error('There must be an existing node');
    }

    const {
        patcher: oldPatcher,
        values: oldValues,
        rules
    } = oldPatchingData;

    const {
        patcher,
        values
    } = newPatchingData;

    if (oldPatcher === patcher) {

        if (areEquivalentValues(oldPatchingData.values, newPatchingData.values)) {

            return; // Same patcher and same vales mean no changes to apply
        }

        oldPatcher.patchNode(node, rules, oldValues, values);

        newPatchingData.rules = rules; // Set the complited rules in the new patched data

        newPatchingData.node = node; // Set the node in the new patching data

        (node as any)._$patchingData = newPatchingData;
    }
    else { // Different type of node, replace it with a new one

        const newNode = createNode(container, newPatchingData);

        container.replaceChild(newNode, node);
    }
}