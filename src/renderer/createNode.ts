import { NodePatcherRule } from "./createNodePatcherRules";
import { NodePatchingData, CompiledNodePatcherRule } from "./NodePatcher";

/**
 * Creates a node according to the patching data of the node
 * @param patchingData 
 * @returns 
 */
export function createNode(parentNode: Node, patchingData: NodePatchingData): Node {

    const {
        patcher,
        values
    } = patchingData;

    const doc = patcher.template.content.cloneNode(/*deep*/true); // The content of the template is a document fragment

    const {
        childNodes
    } = doc;

    let node: Node = undefined;

    if (patcher.isSingleElement) { // Node is single HTMLElement

        node = childNodes[0];

        // Set the node of the patching data
        patchingData.node = node;

        // Attach the patching data to the node
        (node as any)._$patchingData = patchingData;
    }
    else { // Node is a collection of nodes

        node = doc;

        // Set the node of the patching data
        patchingData.node = parentNode;

        if ((parentNode as any)._$patchingData === undefined &&
            (!(parentNode instanceof DocumentFragment) ||
                parentNode instanceof ShadowRoot)) {

            // Attach the patching data to the node if there is none attached
            (parentNode as any)._$patchingData = patchingData;
        }
    }

    const rules = compileRules(doc, patcher.rules);

    // Update the rules of the patching data
    patchingData.rules = rules;

    patcher.firstPatch(doc, rules, values);

    return node;
}

/**
 * Creates a compiled rule by replacing the path with the reference to the node the rule acts upon
 * @param node The content node of the template
 * @param rules The rules to compile
 * @returns the compiled rules
 */
function compileRules(node: Node, rules: NodePatcherRule[]): CompiledNodePatcherRule[] {

    return rules.map(r => {

        return {
            node: findNode(node, r.path),
            type: r.type,
            name: r.name
        };
    });
}

/**
 * Finds the child node following the path
 * @param node The parent node
 * @param path The path to the child node
 * @returns The child node
 */
function findNode(node: Node, path: number[]): HTMLElement | Comment | Text {

    for (let i = 0; i < path.length; ++i) {

        node = node.childNodes[path[i]];
    }

    return node as HTMLElement | Comment | Text;
}