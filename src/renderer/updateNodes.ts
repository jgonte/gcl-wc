import areEquivalentValues from "./areEquivalentValues";
import createNodes from "./createNodes";
import { beginMarker } from "./createTemplate";
import mountNodes from "./mountNodes";
import { NodePatchingData } from "./NodePatcher";

export default function updateNodes(container: Node, oldPatchingData: NodePatchingData | NodePatchingData[], newPatchingData: NodePatchingData | NodePatchingData[]) {

    if (Array.isArray(newPatchingData)) {

        updateArrayNodes(container, oldPatchingData as NodePatchingData[], newPatchingData);
    }
    else {

        let {
            node
        } = oldPatchingData as NodePatchingData;

        if (node === undefined) {

            throw new Error('There must be an existing node');
        }

        const {
            patcher: oldPatcher,
            values: oldValues,
            rules
        } = oldPatchingData as NodePatchingData;

        const {
            patcher,
            values
        } = newPatchingData;

        if (oldPatcher === patcher) {

            newPatchingData.rules = rules; // Set the compiled rules in the new patched data

            newPatchingData.node = node; // Set the node in the new patching data

            if (areEquivalentValues(oldPatchingData.values, newPatchingData.values)) {

                return; // Same patcher and same vales mean no changes to apply
            }

            oldPatcher.patchNode(node, rules, oldValues, values);

            (node as any)._$patchingData = newPatchingData;
        }
        else { // Different type of node, replace it with a new one

            const newNode = createNodes(newPatchingData);

            if ((node as Comment).data === beginMarker) {

                node.nextSibling.remove(); // Remove the end marker as well
            }

            container.replaceChild(newNode, node); // Replace the end marker with the node      
        }
    }
}

function updateArrayNodes(container: Node, oldPatchingData: NodePatchingData[], newPatchingData: NodePatchingData[]) {

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

            mountNodes(container, newPatchingData[i]);
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

                updateNodes(oldChild, oldPatchingData[i], newChildPatchingData);

                if (i >= container.childNodes.length) { // The child was removed when replacing the nodes

                    container.appendChild(oldChild);
                }
            }
            else { // oldChildKey !== valueKey - Find the node that corresponds with the keyed patching data

                if (keyedNodes.has(valueKey)) { // Find an existing keyed node

                    const keyedNode = keyedNodes.get(valueKey);

                    // If the values of the keyed node match the ones of the oldChild then just swap them
                    if (areEquivalentValues(newChildPatchingData.values, (keyedNode as any)._$patchingData.values)) {

                        if (i >= container.childNodes.length) {

                            container.appendChild(keyedNode);
                        }
                        else { // Replace the node

                            container.childNodes[i].replaceWith(keyedNode);

                            --oldCount; // It removes the child from the existing children
                        }

                        newChildPatchingData.node = keyedNode; // Set the node of the new patching data

                        const {
                            rules,
                            values
                        } = (keyedNode as any)._$patchingData;

                        newChildPatchingData.rules = rules;

                        newChildPatchingData.values = values; // Ensure we pass the child values with the attached nodes if any
                    }
                    else { // Some value has changed, patch the existing node

                        updateNodes(oldChild, oldPatchingData[i], (keyedNode as any)._$patchingData);
                    }
                }
                else { // No keyed node found, set the new child

                    updateNodes(oldChild, oldPatchingData[i], newChildPatchingData);
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldCount - 1; i >= newCount; --i) {

        (oldPatchingData[i].node as HTMLElement).remove();
    }
}
