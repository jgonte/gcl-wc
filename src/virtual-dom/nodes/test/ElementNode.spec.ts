import ElementNode from "../ElementNode";
import TextNode from "../TextNode";

describe("creating element virtual nodes tests", () => {

    it('should create an element node with a text child from a virtual element node', () => {
        const vnode = new ElementNode(
            'div',
            {
                attr1: '1',
                attr2: 'Some text'
            },
            [
                new TextNode('Text 1')
            ]
        );

        const domNode = vnode.createDom() as HTMLElement;

        expect(domNode).toBeInstanceOf(HTMLElement);

        expect(domNode.tagName).toEqual('DIV');

        expect(domNode.getAttribute('attr1')).toEqual('1');

        expect(domNode.getAttribute('attr2')).toEqual('Some text');

        expect(domNode.childNodes[0]).toBeInstanceOf(Text);

        expect(domNode.childNodes[0].textContent).toEqual('Text 1');

        // Build a DOM node with similar properties as the existing virtual one
        const similarNode = document.createElement('div');

        similarNode.setAttribute('attr1', '1');

        similarNode.setAttribute('attr2', 'Some text');

        let textNode = document.createTextNode('Text 1');

        similarNode.appendChild(textNode);

        // Test that the patch did not change anything
        expect(vnode.patchDom(similarNode as any)).toBeFalsy(); // Same text, no update performed

        expect(domNode.getAttribute('attr1')).toEqual('1');

        expect(domNode.getAttribute('attr2')).toEqual('Some text');

        expect(similarNode.textContent).toEqual('Text 1');

        // Build a DOM node with different child text node
        const differentNode = document.createElement('div');

        differentNode.setAttribute('attr1', '2');

        differentNode.setAttribute('attr2', 'Some other text');

        textNode = document.createTextNode('Text 2');

        differentNode.appendChild(textNode);

        expect(vnode.patchDom(differentNode as any)).toBeTruthy(); // Different text, update performed

        expect(domNode.getAttribute('attr1')).toEqual('1');

        expect(domNode.getAttribute('attr2')).toEqual('Some text');

        expect(differentNode.textContent).toEqual('Text 1'); // Set the text of the text child virtual node
    });

});