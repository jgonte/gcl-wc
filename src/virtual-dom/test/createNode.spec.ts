import createNode from "../helpers/dom/createNode";

describe("creating DOM nodes from virtual nodes tests", () => {

    it('should create a text node if a string is passed to it', () => {

        const domNode = createNode('Some text');

        expect(domNode).toBeInstanceOf(Text);

        expect(domNode.textContent).toEqual('Some text');
    });

    it('should create an element node if a virtual node with a non null tag is passed to it', () => {

        const domNode = createNode({
            tag: 'span',
            attributes: {
                name: 'Sarah'
            },
            children: ['My name is Sarah']
        });

        expect(domNode).toBeInstanceOf(HTMLElement);

        expect(domNode.outerHTML).toEqual('<span name=\"Sarah\">My name is Sarah</span>');
    });

    it('should create an fragment node if a virtual node with a null tag is passed to it', () => {

        const domNode = createNode({
            tag: null,
            attributes: null,
            children: [
                'Some text',
                {
                    tag: 'span',
                    attributes: {
                        name: 'Sarah'
                    },
                    children: ['My name is Sarah']
                }
            ]
        });

        expect(domNode).toBeInstanceOf(DocumentFragment);

        // Wrap it to test the content
        const div = document.createElement('div');

        div.appendChild(domNode);

        expect(div.outerHTML).toEqual('<div>Some text<span name=\"Sarah\">My name is Sarah</span></div>');
    });
});