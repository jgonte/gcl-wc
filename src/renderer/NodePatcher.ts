export enum NodePatcherRuleTypes {
    PATCH_TEXT,
    PATCH_ATTRIBUTE,
    PATCH_CHILDREN
}

/**
 * The rule to patch the DON node
 */
export interface NodePatcherRule {

    /**
     * The type of patching to do to that node
     */
    type: NodePatcherRuleTypes,

    /**
     * The path to locate the node
     */
    path: number[],

    /**
     * The name of the attribute to patch
     */
    name?: string
}

/**
 * This is the data structure that gets attached to the DOM node that
 * allows us to patch an existing node
 */
export interface NodePatchingData {

    /**
     * The node patcher associated with the node
     */
    patcher: NodePatcher;
}

export default class NodePatcher {

    constructor(

        /**
         * The rules to patch the node by
         */
        private _rules: NodePatcherRule[]
    ) { }

    patch(node: Node, oldValues: any[], newValues: any[]) {

        const {
            _rules
        } = this;

        const {
            length
        } = _rules;

        for (let i = 0; i < length; ++i) {

            const oldValue = oldValues[i];

            const newValue = newValues[i];

            if (oldValue === newValue) {

                continue;
            }

            const rule = _rules[i];

            const {
                type,
                name,
                path
            } = rule;

            const childNode = findNode(node, path);

            switch (type) {

                case NodePatcherRuleTypes.PATCH_TEXT:
                    {
                        const {
                            parentNode
                        } = childNode;

                        if (parentNode !== null) {

                            if (Array.isArray(newValue)) {

                                parentNode.replaceChildren(...newValue);
                            }
                            else {

                                parentNode.replaceChild(document.createTextNode(newValue), childNode);
                            }
                        }
                        else {

                            childNode.textContent = newValue;
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        patchAttribute(childNode as HTMLElement, name, oldValue, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        patchChildren(childNode as HTMLElement, newValues);
                    }
                    break;
                default: throw Error(`patch is not implemented for rule type: ${type}`);
            }

        }
    }
}

function findNode(node: Node, path: number[]): Node {

    for (let i = 0; i < path.length; ++i) {

        const index = path[i];

        node = node.childNodes[index];
    }

    return node;
}

function patchAttribute(node: HTMLElement, name: string, oldValue: string, newValue: string): boolean {

    if (newValue === undefined) { // It was removed in the new virtual node

        node.removeAttribute(name);

        return true;
    }
    else {

        if (newValue === oldValue) {

            return false;
        }
        else {

            setAttribute(node, name, newValue);

            return true;
        }
    }
}

function setAttribute(node: HTMLElement, key: string, value: string) {

    if (value === 'undefined' ||
        value === 'null' ||
        value === '' ||
        value === 'false') {

        node.removeAttribute(key);
    }
    else {

        if (value === 'true') {

            node.setAttribute(key, '');
        }
        else {

            node.setAttribute(key, value);
        }
    }
}

function patchChildren(node: HTMLElement, newChildren: Node[]): boolean {

    let updated = false;

    const {
        childNodes
    } = node;

    let oldChildrenCount = childNodes.length; // It changes when manipulating keyed children

    const oldChildren: Node[] = [];

    // Map the keyed nodes from the old children nodes
    const keyedNodes = new WeakMap<any, Node>();

    for (let i = 0; i < oldChildrenCount; ++i) {

        const oldChild = childNodes[i] as HTMLElement;

        oldChildren.push(oldChild);

        let key = oldChild.getAttribute?.('key') || null;

        if (key !== null) {

            keyedNodes.set(key, node);
        }
    }

    const newChildrenCount = newChildren.length;

    // Loop through the new children
    for (let i = 0; i < newChildrenCount; ++i) {

        const newChild = newChildren[i] as HTMLElement;

        const oldChild = oldChildren[i] as HTMLElement;

        if (oldChild === undefined) {

            node.insertBefore(newChild, null);

            updated = true
        }
        else { // oldChild !== undefined

            const oldChildKey = oldChild.getAttribute?.('key') || null;

            const newChildKey = newChild.getAttribute?.('key') || null;

            if (newChildKey === oldChildKey) {

                if (oldChild.nodeType === newChild.nodeType &&
                    oldChild.tagName === newChild.tagName) { // Nodes match

                    throw new Error('Not implemented');
                    // if (vnode.patchDom(domNode as any) === true) {

                    //                         updated = true;
                    //                     }

                }
                else { //Nodes do not match

                    node.replaceChild(newChild, oldChild);
                }

            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // Find an existing keyed node

                    const keyedOldNode = keyedNodes.get(newChildKey);

                    // if (vnode.patchDom(newNode as any) === true) {

                    //     updated = true;
                    // }

                    if (oldChildrenCount >= newChildrenCount) {

                        node.insertBefore(keyedOldNode, oldChild);

                        --oldChildrenCount; // The oldNode is removed from the container
                    }
                    else {

                        node.insertBefore(keyedOldNode, null);

                        ++oldChildrenCount; // The newNode is added to the container
                    }
                }
                else { // No keyed node found, set the new child

                    node.insertBefore(newChild, null);

                    ++oldChildrenCount; // Update the count of extra nodes to remove
                }

                updated = true;
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {

        node.childNodes[i].remove();

        updated = true;
    }

    return updated;
}

