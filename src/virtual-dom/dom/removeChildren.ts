export default function removeChildren(parent: Node | Document) {

    let node = parent.lastChild;

    while (node !== undefined) {

        parent.removeChild(node);

        node = node.previousSibling;
    }
}