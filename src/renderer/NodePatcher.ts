import { isPrimitive } from "../utils/shared";
import createTemplate, { attributeMarkerPrefix, eventMarkerPrefix, nodeMarker } from "./createTemplate";
import { createNode } from "./createNode";
import areEquivalentValues from "./areEquivalentValues";
import getGlobalFunction from "../custom-element/helpers/getGlobalFunction";
import { mountNode } from "./mount";
import { patchNode } from "./patchNode";
import { updateNode } from "./update";

export enum NodePatcherRuleTypes {
    PATCH_NODE = 1, // Patches either a single node or a collection of nodes
    PATCH_ATTRIBUTE,
    PATCH_EVENT
}

/**
 * The rule to "compile" to patch the DOM node
 */
export interface NodePatcherRule {

    /**
     * The type of patching to do to that node
     */
    type: NodePatcherRuleTypes;

    /**
     * The path to locate the node
     */
    path: number[];

    /**
     * The name of the attribute to patch
     * Only populated if it is an attribute or an event
     */
    name?: string;
}

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
                        else if (value !== null) {

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

                                        removeAllSiblings(node);
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
                        patchAttribute(node as HTMLElement, name, oldValue, newValue);
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

function createNodePatcherRules(node: Node, path: number[] = [], rules: NodePatcherRule[] = []): NodePatcherRule[] {

    const {
        childNodes
    } = node;

    const {
        length
    } = childNodes;

    if (node.nodeType === Node.COMMENT_NODE &&
        (node as Text).data === nodeMarker) {

        rules.push({
            type: NodePatcherRuleTypes.PATCH_NODE,
            path: [...path]
        });

        return rules; // Comments do not have attributes and children so we are done
    }
    else if (node.nodeType === Node.TEXT_NODE) {

        return rules; // No need to create rules for a text literal
    }
    else {

        const attributes = (node as HTMLElement).attributes;

        if (attributes !== undefined) {

            rules = createAttributePatcherRules(attributes, path, rules);
        }
    }

    for (let i = 0; i < length; ++i) {

        rules = createNodePatcherRules(childNodes[i], [...path, i], rules);
    }

    return rules;
}

function createAttributePatcherRules(attributes: NamedNodeMap, path: number[], rules: NodePatcherRule[]): NodePatcherRule[] {

    const {
        length
    } = attributes;

    for (let i = 0; i < length; ++i) {

        const value = attributes[i].value;

        if (value.startsWith(attributeMarkerPrefix)) {

            const name = value.split(':')[1];

            rules.push({
                type: NodePatcherRuleTypes.PATCH_ATTRIBUTE,
                path,
                name
            });
        }
        else if (value.startsWith(eventMarkerPrefix)) {

            const name = value.split(':')[1];

            rules.push({
                type: NodePatcherRuleTypes.PATCH_EVENT,
                path,
                name
            });
        }
    }

    return rules;
}

function patchAttribute(node: HTMLElement, name: string, oldValue: string, newValue: string): boolean {

    if (newValue === undefined) { // It was removed in the new virtual node

        node.removeAttribute(name);
    }
    else {

        setAttribute(node, name, newValue);
    }

    return true;
}

function setAttribute(node: HTMLElement, key: string, value: string) {

    if (value === undefined ||
        value === 'undefined' ||
        value === 'null' ||
        value === '' ||
        value === 'false') {

        node.removeAttribute(key);

        // Reset the value in any case
        if (key === 'value' && value === undefined) { // It fails with undefined for a text field value

            (node as any)[key] = '';
        }
        else {

            (node as any)[key] = value;
        }
    }
    else {

        if (value === 'true') {

            node.setAttribute(key, '');
        }
        else {

            const type = typeof value;

            if (type === 'function') {

                node.removeAttribute(key); // It is similar to an event. Do not show as attribute

                (node as any)[key] = value; // Bypass the stringification of the attribute
            }
            else if (type === 'object') {

                value = JSON.stringify(value);

                node.setAttribute(key, value);
            }
            else { // Any other type

                if (key === 'value') { // Set the value besides setting the attribute

                    (node as HTMLInputElement).value = value;
                }
                
                node.setAttribute(key, value);
            }
        }
    }
}

function patchChildren(markerNode: Node, oldChildren: any = [], newChildren: any = []): void {

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

                patchNode((oldChild as any).node, newChild as any);
            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // Find an existing keyed node

                    const keyedOldNode = keyedNodes.get(newChildKey);

                    // if (vnode.patchDom(newNode as any) === true) {

                    //     updated = true;
                    // }

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

        // if (newChildrenCount > oldChildrenCount) { // Insert the children

        //     appendChildren(markerNode, newChildren);
        // }
        // else { // There are old children

        //     throw new Error('patchChildren is not implemented');
        // }

        // if (childNode === undefined) { // The node does not have any child at that path

        //     childNode = node as HTMLElement;
        // }

        // const parentNode = (childNode.parentNode !== null ?
        //     childNode.parentNode :
        //     childNode) as HTMLElement;

        // let { childNodes } = parentNode;

        // if (Array.isArray(newValue)) { // Collection of nodes

        //     if (
        //         childNode.nodeType === Node.COMMENT_NODE &&
        //         (childNode as Comment).data === nodeMarker
        //     ) {

        //         parentNode.replaceChildren(...newValue); // Replace the marker with the children

        //         // If the newValue is an array of document fragments, they will lose their children after replacement
        //         // Ensure the children have the instance of the patching data
        //         childNodes = parentNode.childNodes;

        //         const length = childNodes.length;

        //         for (let i = 0; i < length; ++i) {

        //             const instancePatchingData = newValue[i].__instancePatchingData__;

        //             if (instancePatchingData !== undefined) {

        //                 (childNodes[i] as any).__instancePatchingData__ = instancePatchingData;
        //             }
        //         }
        //         // Restore the values
        //         newValuesHolder.newValues = [Array.from(childNodes)];
        //     }
        //     else { // Parent node has children

        //         patchChildren(parentNode, newValue); // Patch the existing children
        //     }
        // }
        // else { // Single value or node

        //     if (newValue instanceof DocumentFragment) {

        //         parentNode.replaceChild(newValue, childNode);
        //     }
        //     else {

        //         parentNode.replaceChild(document.createTextNode(newValue), childNode);
        //     }
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

function replaceChild(markerNode: Node, newChild: Node, oldChild: Node) {

    const {
        parentNode
    } = markerNode;

    if (isPrimitive(newChild) &&
        isPrimitive(oldChild)) {

        // Find the node whose old value matches the old child
        const oldChildNode = findPreviousSibling(markerNode,
            node => node instanceof Text &&
                (node as Text).textContent === oldChild.toString());

        if (oldChildNode !== null) { // Otherwise already updated???

            (oldChildNode as Text).textContent = newChild.toString();
        }

    }
    else if ((oldChild as any).patcher !== undefined) { // Patching data

        // Find the node whose patching data matches this one
        let oldChildNode = null;

        findPreviousSibling(
            markerNode,
            node => testThisOrAnyParent(node, n => {

                if (n._$patchingData === undefined) {

                    return false;
                }

                const {
                    patcher,
                    values
                } = n._$patchingData;

                const {
                    patcher: otherPatcher,
                    values: otherValues
                } = oldChild as any;

                const r = patcher === otherPatcher &&
                    values === otherValues;

                if (r === true) {

                    oldChildNode = n;
                }

                return r;
            }));

        const {
            patcher: oldPatcher,
            rules,
            values: oldValues
        } = (oldChildNode as any)._$patchingData;

        const {
            patcher,
            values
        } = (newChild as any);

        if (patcher === oldPatcher) {

            if ((newChild as any).rules === null) {

                (newChild as any).rules = rules; // Transfer the compiled rules
            }

            oldPatcher.patchNode(oldChildNode, rules, oldValues, values);

            (oldChildNode as any)._$patchingData.values = values; // Update the latest values 
        }
        else {

            throw new Error('Not implemented');
        }
    }
    else {

        parentNode.replaceChild(newChild, oldChild);
    }
}

function findPreviousSibling(markerNode: Node, predicate: (node: any) => boolean): Node {

    let {
        previousSibling
    } = markerNode;

    while (previousSibling !== null &&
        (previousSibling as Comment).textContent !== nodeMarker) {

        if (predicate(previousSibling) === true) {

            return previousSibling;
        }

        previousSibling = previousSibling.previousSibling;
    }

    return null;
}

function testThisOrAnyParent(node: Node, predicate: (n: any) => boolean): boolean {

    let parentNode = node;

    while (parentNode !== null) {

        if (predicate(parentNode) === true) {

            return true;
        }

        parentNode = parentNode.parentNode;
    }

    return false;
}

function removeLeftSibling(markerNode: Node) {

    const {
        parentNode,
        previousSibling
    } = markerNode;

    parentNode.removeChild(previousSibling);
}

function removeAllSiblings(markerNode: Node) {

    const {
        parentNode
    } = markerNode;

    let sibling = markerNode.previousSibling;

    while (sibling !== null) {

        parentNode.removeChild(sibling);

        sibling = markerNode.previousSibling;
    }
}

// function findParentNode(parentNode: Node, predicate: (node: any) => boolean) : Node {

//     for (let node = parentNode; node !== null; node = node.parentNode) {

//         if (predicate(node) === true) {

//             return node;
//         }
//     }

//     return null;
// }
