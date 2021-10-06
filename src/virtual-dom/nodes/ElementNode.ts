import patchChildren from "./helpers/patchChildren";
import TextNode from "./TextNode";

const svgElements = ['svg', 'use', 'symbol', 'path', 'g', 'defs', 'title'];

export default class ElementNode {

    constructor(

        /**
         * The name of the element
         */
        public tag: string,

        /**
         * The attributes of the element
         */
        public attributes: Record<PropertyKey, any> | null,

        /**
         * The children of the element or the text
         */
        public children: (ElementNode | TextNode)[]

    ) { }

    get key(): string {

        return this.attributes?.key;
    }

    /**
     * Creates a DOM node from this virtual node
     * @returns The text node
     */
    createDom(): HTMLElement {

        const {
            tag,
            attributes,
            children,
        } = this;

        let node = null;

        // Create the element
        if (tag === null) { // Fragment node

            node = document.createDocumentFragment();
        }
        else if (svgElements.includes(tag) === true) {

            node = document.createElementNS('http://www.w3.org/2000/svg', tag);

            node.isSvg = true;

        } else {

            node = document.createElement(tag);
        }

        for (let key in Object(attributes)) {

            setAttribute(node, key, attributes[key]);  
        }
        for (let i = 0; i < children.length; ++i) {

            node.appendChild(children[i].createDom());
        }

        return node;
    }

    /**
     * Patches the DOM node according to the internal state
     * @param value 
     * @returns 
     */
    patchDom(node: HTMLElement): boolean {

        const {
            tag,
            attributes,
            children,
        } = this;

        let updated = false;

        if (tag.toUpperCase() === node.tagName) { // Check if the attributes and children changed

            if (this._patchAttributes(node, attributes || {}) === true) {

                updated = true;
            }

            if (patchChildren(node, children) === true) {

                updated = true;
            }

        }
        else { // Different tags, replace the element

            throw 'patchDom not implemented for different tags';
            // return vnode.$node = node = createNode(vnode);
        }

        return updated;
    }

    private _patchAttributes(node: HTMLElement, attributes: Record<PropertyKey, any> = {}): boolean {

        let updated = false;

        const nodeAttributes = toRecord(node.attributes);

        const mergedAttributes = { ...nodeAttributes, ...attributes};

        for (const key of Object.keys(mergedAttributes)) {

            const value = attributes[key];

            if (value === undefined) { // It was removed in the new virtual node

                node.removeAttribute(key);

                updated = true;
            }
            else {

                const oldValue = nodeAttributes[key];

                if (value !== oldValue) {

                    setAttribute(node, key, value);

                    updated = true;
                }
            }
        }

        return updated;
    }
}

function setAttribute(node: HTMLElement, key: string, value: string) {

    if (value === 'undefined' ||
        value === 'null' ||
        value === '' ||
        value === 'false') {

        (node as HTMLElement).removeAttribute(key);
    }
    else {

        if (value === 'true') {

            (node as HTMLElement).setAttribute(key, '');
        }
        else {

            (node as HTMLElement).setAttribute(key, value);
        }
    }
}

function toRecord(attributes: NamedNodeMap): Record<PropertyKey, string> {

    const record: Record<PropertyKey, string> = {};

    const length = attributes.length;

    for (let i = 0; i < length; ++i) {

        const attribute = attributes[i];

        record[attribute.name] = attribute.value;
    }

    return record;
}
