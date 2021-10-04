import TextNode from "../TextNode";

describe("creating text virtual nodes tests", () => {

    it('should create a text node from a string', () => {

        const vnode = new TextNode('Some text');

        const domNode = vnode.createDom();

        expect(domNode).toBeInstanceOf(Text);

        expect(domNode.textContent).toEqual('Some text');

        const similarTextNode = document.createTextNode('Some text');

        expect(vnode.patchDom(similarTextNode)).toBeFalsy(); // Same text, no update performed

        expect(similarTextNode.textContent).toEqual('Some text');

        const differentTextNode = document.createTextNode('Some other text');

        expect(vnode.patchDom(differentTextNode)).toBeTruthy(); // Different text, update performed

        expect(differentTextNode.textContent).toEqual('Some text'); // Set the text of the virtual node
    });

    it('should create a text node from a number', () => {

        const vnode = new TextNode(5);

        const domNode = vnode.createDom();

        expect(domNode).toBeInstanceOf(Text);

        expect(domNode.textContent).toEqual('5');

        const similarTextNode = document.createTextNode('5');

        expect(vnode.patchDom(similarTextNode)).toBeFalsy(); // Same text, although different type, no update performed

        expect(similarTextNode.textContent).toEqual('5');
    });

});