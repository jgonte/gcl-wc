import { NodePatcherRule } from "./createNodePatcherRules";
import { CompiledNodePatcherRule, NodePatchingData } from "./NodePatcher";

/**
 * Creates the nodes to be appended to the parent one according to the patching data 
 * @param patchingData The patching data to create the nodes from
 * @returns The list of the created nodes
 */
 export function createNodes(patchingData: NodePatchingData): Node {

    const {
        patcher,
        values
    } = patchingData;

    const doc = patcher.template.content.cloneNode(/*deep*/true); // The content of the template is a document fragment

    const rules = compileRules(doc, patcher.rules);

    const {
        childNodes
    } = doc;

     // Set the first node as holder of the patching data
    const node = childNodes[0];

    patchingData.node = node;

    // Attach the patching data to the node
    (node as any)._$patchingData = patchingData;

    // Update the rules of the patching data
    patchingData.rules = rules;

    patcher.firstPatch(doc, rules, values);

    return doc; // Return the DocumentFragment to its children can efficiently transferred to the container
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
