// import ElementNode from "./nodes/ElementNode";
// import FragmentNode from "./nodes/FragmentNode";
// import TextNode from "./nodes/TextNode";

export default class MarkupParsingResult {

    constructor(
        /**
         * The virtual node extracted from the node parsed from the markup
         */
        //public vnode?: ElementNode | TextNode | FragmentNode | null,

        /**
         * The DOM node parsed from the markup
         */
        public node?: Node | DocumentFragment
    ) { }

    appendSibling(result: MarkupParsingResult): MarkupParsingResult {

        const {
            //vnode,
            node
        } = this;

        //if ((vnode.constructor as any).isFragment) {
        if (node instanceof DocumentFragment) {

            //(vnode as FragmentNode).children.push(result.vnode as any);

            node.insertBefore(result.node, null);

            return this;
        }
        else { // Wrap it in a fragment

            //const wrapperVNode = new FragmentNode([ vnode as ElementNode, result.vnode as ElementNode]);

            const wrapperNode = new DocumentFragment();

            wrapperNode.insertBefore(node, null);

            wrapperNode.insertBefore(result.node, null);

            return new MarkupParsingResult(/*wrapperVNode,*/ wrapperNode);
        }
    }

    patch(result: MarkupParsingResult, container: HTMLElement): void {

        const {
            node
        } = result;

        container = node instanceof DocumentFragment ?
            container :
            node as any;


            

        //(this.vnode as ElementNode).patchDom(container);

        // newResult.$node = this._oldResult.$node; // Set the existing DOM node to be patched

        // if (newResult.tag === null) { // Document fragment

        //     (this.document as HTMLElement).replaceChildren(...Array.from(patchNode(newResult, this.document).childNodes));

        // }
        // else {

        //     this.document.replaceChild(patchNode(newResult, this.document), this._oldResult.$node);
        // }
    }
}
