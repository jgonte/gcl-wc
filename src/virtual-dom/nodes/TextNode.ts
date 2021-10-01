export default class TextNode {

    static isText: boolean = true;

    constructor(

        /**
         * The text of the element
         */
        public text: string | number | boolean

    ) {}

    /**
     * Creates a DOM node from this virtual node
     * @returns The text node
     */
    createDom(): Text {

        return document.createTextNode(this.text.toString());
    }

    /**
     * Patches the DOM node according to the internal state
     * @param value 
     * @returns 
     */
    patchDom(node: Text): boolean {

        const text = this.text.toString(); // Convert the equivalent value to string

        if (node.textContent === text) {

            return false; // Same text content
        }

        node.textContent = text;

        return true;
    }
}