import { isPrimitive } from "../utils/shared";
import createTemplate, { NodePatcherRuleTypes } from "./createTemplate";
import areEquivalentValues from "./areEquivalentValues";
import getGlobalFunction from "../custom-element/helpers/getGlobalFunction";
import createNodePatcherRules, { NodePatcherRule } from "./createNodePatcherRules";
import { setAttribute } from "./dom/setAttribute";
import { removeLeftSiblings } from "./dom/removeLeftSiblings";
import { removeLeftSibling } from "./dom/removeLeftSibling";
import { replaceChild } from "./dom/replaceChild";
import { mountNodes } from "./mountNodes";
import { createNodes } from "./createNodes";
import { updateNodes } from "./updateNodes";

export interface CompiledNodePatcherRule {

    /**
     * The type of patching to do to that node
     */
    type: NodePatcherRuleTypes;

    /**
     * The node the rule is acting upon
     */
    node: Node;

    /**
     * The name of the attribute to patch
     * Only populated if it is an attribute or an event
     */
    name?: string,
}

/**
 * The patching data with the information to patch a node
 */
export interface NodePatchingData {

    /**
     * The node to be patched (it does not exist until it is created if needed)
     */
    node?: Node;

    /**
     * The patcher to patch the node with the values according to the rules
     */
    patcher: NodePatcher;

    /**
     * The rules to use to patch the node
     */
    rules: CompiledNodePatcherRule[];

    /**
     * The values used to feed the rules
     */
    values: any[];
}

export class NodePatcher {

    /**
     * The inner HTML of the template content to help debugging
     */
    templateString: string;

    /**
     * The template to clone and generate the node from
     */
    template: HTMLTemplateElement;

    /**
     * The rules to be cloned (compiled)to execute the patching
     */
    rules: NodePatcherRule[];

    /**
     * The index of the dynamic property where the key is
     */
    keyIndex: number;

    /**
     * Whether the content of the template has a single element
     */
    isSingleElement: boolean;

    constructor(strings: TemplateStringsArray) {

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        this.templateString = templateString; // To make debugging easier

        this.template = template;

        const childNodes = template.content.childNodes;

        this.isSingleElement = childNodes.length === 1 &&
            childNodes[0].nodeType === Node.ELEMENT_NODE;

        this.rules = createNodePatcherRules(template.content);

        this.keyIndex = keyIndex;
    }

    firstPatch(parentNode: Node, rules: CompiledNodePatcherRule[], values: any[] = []) {

        const {
            length
        } = rules;

        for (let i = 0; i < length; ++i) { // The index of the values of the rules match 1 to 1 with the number of rules

            let value = values[i];

            const rule = rules[i];

            const {
                type,
                name,
                node
            } = rule;

            switch (type) {

                case NodePatcherRuleTypes.PATCH_NODE:
                    {
                        const { parentNode } = node;

                        if (Array.isArray(value)) {

                            const df = document.createDocumentFragment();

                            value.forEach(v => {

                                if (isPrimitive(v)) {

                                    const n = document.createTextNode(value.toString());

                                    parentNode.insertBefore(n, node);
                                }
                                else {

                                    mountNodes(df, v);
                                }
                            });

                            parentNode.insertBefore(df, node);
                        }
                        else if (value !== undefined &&
                            value !== null) {

                            let n = value;

                            if (isPrimitive(value)) {

                                n = document.createTextNode(value.toString());
                            }
                            else if ((value as NodePatchingData).patcher !== undefined) {

                                n = createNodes(value as NodePatchingData);
                            }

                            parentNode.insertBefore(n, node);
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        setAttribute(node as HTMLElement, name, value);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const eventName: string = name.slice(2).toLowerCase();

                        const nameParts = eventName.split('_'); // Just in case it has the capture parameter in the event

                        const useCapture: boolean = nameParts[1]?.toLowerCase() === 'capture'; // The convention is: eventName_capture for capture. Example onClick_capture

                        if (typeof value === 'string') {

                            value = getGlobalFunction(value);
                        }

                        if (value !== undefined) {

                            node.addEventListener(eventName, value, useCapture);
                        }

                        // Remove the attribute from the HTML
                        (node as HTMLElement).removeAttribute(name);
                    }
                    break;
                default: throw Error(`firstPatch is not implemented for rule type: ${type}`);
            }
        }
    }

    patchNode(parentNode: Node, rules: CompiledNodePatcherRule[], oldValues: any[] = [], newValues: any[] = [], compareValues: boolean = true) {

        const {
            length
        } = rules;

        for (let i = 0; i < length; ++i) { // The index of the values of the rules match 1 to 1 with the number of rules

            const oldValue = oldValues[i];

            let newValue = newValues[i];

            if (compareValues === true && // False when the node is created to remove placeholders from the attributes
                areEquivalentValues(oldValue, newValue)) {

                continue;
            }

            const rule = rules[i];

            const {
                type,
                name,
                node
            } = rule;

            switch (type) {

                case NodePatcherRuleTypes.PATCH_NODE:
                    {
                        if (Array.isArray(newValue)) {

                            patchChildren(node, oldValue, newValue);
                        }
                        else { // Single node

                            if (newValue !== undefined &&
                                newValue !== null) {

                                if (oldValue === undefined ||
                                    oldValue === null) {

                                    insertBefore(node, newValue, rules);
                                }
                                else {

                                    if (oldValue.patcher !== undefined &&
                                        oldValue.patcher === newValue.patcher) {

                                        updateNodes(node, oldValue, newValue);
                                    }
                                    else {

                                        replaceChild(node, newValue, oldValue);
                                    }
                                }
                            }
                            else { // newValue === undefined || null

                                if (oldValue !== undefined &&
                                    oldValue !== null) {

                                    if (Array.isArray(oldValue) || // Several nodes to remove
                                        oldValue.patcher !== undefined) {

                                        removeLeftSiblings(node);
                                    }
                                    else { // Only one node to remove

                                        removeLeftSibling(node);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        setAttribute(node as HTMLElement, name, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const eventName: string = name.slice(2).toLowerCase();

                        const nameParts = eventName.split('_'); // Just in case it has the capture parameter in the event

                        const useCapture: boolean = nameParts[1]?.toLowerCase() === 'capture'; // The convention is: eventName_capture for capture. Example onClick_capture

                        if (typeof newValue === 'string') {

                            newValue = getGlobalFunction(newValue);
                        }

                        if (oldValue === undefined &&
                            newValue !== undefined) {

                            node.addEventListener(eventName, newValue, useCapture);
                        }
                        else {

                            node.removeEventListener(eventName, newValue, useCapture);
                        }

                        // Remove the attribute from the HTML
                        (node as HTMLElement).removeAttribute(name);
                    }
                    break;
                default: throw Error(`patch is not implemented for rule type: ${type}`);
            }

        }
    }
}

function patchChildren(markerNode: Node, oldChildren: any = [], newChildren: any = []): void {

    oldChildren = oldChildren || [];

    let { length: oldChildrenCount } = oldChildren;

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new Map<any, Node>();

    for (let i = 0; i < oldChildrenCount; ++i) {

        const oldChild = oldChildren[i];

        let key = getKey(oldChild);

        if (key !== null) {

            keyedNodes.set(key, oldChild);
        }
    }

    const { length: newChildrenCount } = newChildren;

    for (let i = 0; i < newChildrenCount; ++i) {

        const newChild = newChildren[i];

        const oldChild = oldChildren[i];

        if (oldChild === undefined) {

            insertBefore(markerNode, newChild, null);
        }
        else { // oldChild !== undefined

            const oldChildKey = getKey(oldChild);

            const newChildKey = getKey(newChild);

            if (newChildKey === oldChildKey) {

                if (isPrimitive(oldChild)) {

                    replaceChild(markerNode, newChild, oldChild)
                }
                else {

                    updateNodes((oldChild as any).node, oldChild as any, newChild as any);
                }
            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // Find an existing keyed node

                    const keyedOldNode = keyedNodes.get(newChildKey);

                    if (oldChildrenCount >= newChildrenCount) {

                        replaceChild(markerNode, newChild, oldChild);
                    }
                    else {

                        insertBefore(markerNode, keyedOldNode, null);

                        ++oldChildrenCount; // The newNode is added to the container
                    }
                }
                else { // No keyed node found, set the new child at the current index

                    const { parentNode } = markerNode;

                    let newNode: Node;

                    if (isPrimitive(newChild)) {

                        newNode = document.createTextNode(newChild.toString());
                    }
                    else if ((newChild as NodePatchingData).patcher !== undefined) {

                        newNode = createNodes(newChild as NodePatchingData);
                    }
                    // else { newChild is never an actual node?

                    //     newNode = newChild;
                    // }

                    const existingChild = parentNode.childNodes[i + 1]; // Skip the begin marker node

                    existingChild.replaceWith(newNode);
                    // insertBefore(existingChild, newChild, null);

                    // ++oldChildrenCount; // Update the count of extra nodes to remove
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {

        removeLeftSibling(markerNode);
    }
}

/**
 * Retrieves the key from the patching data
 * @param patchingData 
 * @returns 
 */
function getKey(patchingData: NodePatchingData) {

    const {
        patcher,
        values
    } = patchingData as NodePatchingData;

    const {
        keyIndex
    } = patcher;

    return keyIndex !== undefined ?
        values[keyIndex] :
        null;
}

function insertBefore(markerNode: Node, newChild: Node | NodePatchingData, rules: CompiledNodePatcherRule[]): void {

    const { parentNode } = markerNode;

    if (isPrimitive(newChild)) {

        newChild = document.createTextNode(newChild.toString());
    }
    else if ((newChild as NodePatchingData).patcher !== undefined) {

        newChild = createNodes(newChild as NodePatchingData);
    }

    parentNode.insertBefore(newChild as Node, markerNode);
}