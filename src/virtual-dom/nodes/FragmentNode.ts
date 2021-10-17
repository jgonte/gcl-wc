// import ElementNode from "./ElementNode";
// import patchChildren from "./helpers/patchChildren";
// import TextNode from "./TextNode";

// export default class FragmentNode {

//     static isFragment: boolean = true;

//     constructor(

//         /**
//          * The children of the virtual node
//          */
//         public children: (ElementNode | TextNode)[]
//     ) { }

//     /**
//      * Creates a DOM node from this virtual node
//      * @returns DocumentFragment that holds the children nodes
//      */
//     createDom(): DocumentFragment {

//         const { children } = this;

//         const node = document.createDocumentFragment();

//         for (const child of children) {

//             node.appendChild(child.createDom());
//         }

//         return node;
//     }

//     patchDom(container: HTMLElement | DocumentFragment): boolean {

//         return patchChildren(container, this.children);
//     }
// }