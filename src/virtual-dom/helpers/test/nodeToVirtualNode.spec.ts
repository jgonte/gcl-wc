import ElementNode from "../../nodes/ElementNode";
import TextNode from "../../nodes/TextNode";
import nodeToVirtualNode from "../nodeToVirtualNode";

describe("convert from a DOM node to a virtual one tests", () => {

    it('should create a virtual element node from an HTML one', () => {

        // Create a virtual node to compare against
        const vnode = new ElementNode(
            'div',
            {
                category: 'children'
            },
            [
                new ElementNode(
                    'span',
                    {
                        key: '1',
                        age: '19'
                    },
                    [
                        new TextNode('Sarah')
                    ]
                ),
                new ElementNode(
                    'span',
                    {
                        key: '2',
                        age: '31'
                    },
                    [
                        new TextNode('Mark')
                    ]
                )
            ]
        );

        // Create the DOM node from the virtual node
        const domNode = vnode.createDom();

        // Recreate the virtual node from the DOM one
        const newVNode = nodeToVirtualNode(domNode);

        // Compare
        expect(newVNode).toEqual(vnode);
    });

});