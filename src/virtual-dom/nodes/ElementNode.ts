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

            throw 'Not implemented'
            // return vnode.$node = node = createNode(vnode);
        }

        return updated;
    }

    private _patchAttributes(node: HTMLElement, attributes: Record<PropertyKey, any> = {}): boolean {

        let updated = false;

        for (const [key, value] of Object.entries(attributes)) {

            if (this._patchAttribute(node, key, value) === true) {

                updated = true;
            }
        }

        return updated;
    }

    private _patchAttribute(node: HTMLElement, key: string, value: string): boolean {

        const oldValue = node.getAttribute(key);

        if (oldValue === value) {

            return false;
        }

        setAttribute(node, key, value);

        return true; // Value changed
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