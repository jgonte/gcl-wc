import { isPrimitive } from "../utils/shared";
import createTemplate, { NodePatcherRuleTypes } from "./createTemplate";
import { createNode } from "./createNode";
import areEquivalentValues from "./areEquivalentValues";
import getGlobalFunction from "../custom-element/helpers/getGlobalFunction";
import { mountNode } from "./mount";
import { updateNode } from "./update";
import createNodePatcherRules, { NodePatcherRule } from "./createNodePatcherRules";
import { setAttribute } from "./dom/setAttribute";
import { removeLeftSiblings } from "./dom/removeLeftSiblings";
import { removeLeftSibling } from "./dom/removeLeftSibling";
import { replaceChild } from "./dom/replaceChild";

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
                        if (Array.isArray(value)) {

                            const df = document.createDocumentFragment();

                            value.forEach(v => mountNode(df, v));

                            node.parentNode.insertBefore(df, node);
                        }
                        else if (value !== undefined && 
                            value !== null) {

                            const { parentNode } = node;

                            let n = value;

                            if (isPrimitive(value)) {

                                n = document.createTextNode(value.toString());
                            }
                            else if ((value as NodePatchingData).patcher !== undefined) {

                                n = createNode(parentNode, value as NodePatchingData);
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

                            if (newValue !== null) {

                                if (oldValue === undefined ||
                                    oldValue === null) {

                                    insertBefore(node, newValue, rules);
                                }
                                else {

                                    if (oldValue.patcher !== undefined &&
                                        oldValue.patcher === newValue.patcher) {

                                        updateNode(node, oldValue, newValue);
                                    }
                                    else {

                                        replaceChild(node, newValue, oldValue);
                                    }
                                }
                            }
                            else { // newValue === undefined || null

                                if (oldValue !== undefined &&
                                    oldValue !== null) {

                                    if (Array.isArray(oldValue) ||
                                        oldValue.patcher !== undefined) {

                                        removeLeftSiblings(node);
                                    }
                                    else {

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

        const oldChild = oldChildren[i] as HTMLElement;

        let key = oldChild.getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, oldChild);
        }
    }

    const { length: newChildrenCount } = newChildren;

    for (let i = 0; i < newChildrenCount; ++i) {

        const newChild = newChildren[i] as HTMLElement;

        const oldChild = oldChildren[i] as HTMLElement;

        if (oldChild === undefined) {

            insertBefore(markerNode, newChild, null);
        }
        else { // oldChild !== undefined

            const oldChildKey = oldChild.getAttribute?.('key') || null;

            const newChildKey = newChild.getAttribute?.('key') || null;

            if (newChildKey === oldChildKey) {

                updateNode((oldChild as any).node, oldChild as any, newChild as any);
            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // Find an existing keyed node

                    const keyedOldNode = keyedNodes.get(newChildKey);

                    if (oldChildrenCount >= newChildrenCount) {

                        insertBefore(markerNode, keyedOldNode, null);

                        --oldChildrenCount; // The oldNode is removed from the container
                    }
                    else {

                        insertBefore(markerNode, keyedOldNode, null);

                        ++oldChildrenCount; // The newNode is added to the container
                    }
                }
                else { // No keyed node found, set the new child

                    insertBefore(markerNode, newChild, null);

                    ++oldChildrenCount; // Update the count of extra nodes to remove
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {

        removeLeftSibling(markerNode);
    }
}

function insertBefore(markerNode: Node, newChild: Node | NodePatchingData, rules: CompiledNodePatcherRule[]): void {

    const { parentNode } = markerNode;

    if (isPrimitive(newChild)) {

        newChild = document.createTextNode(newChild.toString());
    }
    else if ((newChild as NodePatchingData).patcher !== undefined) {

        newChild = createNode(parentNode, newChild as NodePatchingData);
    }

    parentNode.insertBefore(newChild as Node, markerNode);
}