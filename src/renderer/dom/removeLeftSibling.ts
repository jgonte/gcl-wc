export function removeLeftSibling(markerNode: Node) {

    const {
        parentNode,
        previousSibling
    } = markerNode;

    parentNode.removeChild(previousSibling);
}