import ElementNode from "../../nodes/ElementNode";
import FragmentNode from "../../nodes/FragmentNode";
import TextNode from "../../nodes/TextNode";

describe("creating fragment virtual nodes tests", () => {

    it('should create fragment node with a text child from a virtual fragment node', () => {

        const vnode = new FragmentNode([
            new TextNode('Text 1')
        ]);

        const domNode = vnode.createDom();

        expect(domNode).toBeInstanceOf(DocumentFragment);

        expect(domNode.childNodes[0]).toBeInstanceOf(Text);

        expect(domNode.childNodes[0].textContent).toEqual('Text 1');

        // Build a DOM node with similar properties as the existing virtual one
        const similarFragmentNode = document.createDocumentFragment();

        let textNode = document.createTextNode('Text 1');

        similarFragmentNode.appendChild(textNode);

        // Test that the patch did not change anything
        expect(vnode.patchDom(similarFragmentNode)).toBeFalsy(); // Same text, no update performed

        expect(similarFragmentNode.textContent).toEqual('Text 1');

        // Build a DOM node with different child text node
        const differentFragmentNode = document.createDocumentFragment();

        textNode = document.createTextNode('Text 2');

        differentFragmentNode.appendChild(textNode);

        expect(vnode.patchDom(differentFragmentNode)).toBeTruthy(); // Different text, update performed

        expect(differentFragmentNode.textContent).toEqual('Text 1'); // Set the text of the text child virtual node
    });

    it('should create fragment node with a element child from a virtual fragment node', () => {

        const vnode = new FragmentNode([
            new ElementNode(
                'div',
                {
                    key: '1'
                },
                []
            )
        ]);

        const domNode = vnode.createDom();

        expect(domNode).toBeInstanceOf(DocumentFragment);

        expect(domNode.childNodes[0]).toBeInstanceOf(HTMLElement);

        expect((domNode.childNodes[0] as HTMLElement).innerHTML).toEqual('');

        // Build a DOM node with similar properties as the existing virtual one
        const similarFragmentNode = document.createDocumentFragment();

        let childNode = document.createElement('div');

        (childNode as any).setAttribute('key', '1');

        expect(childNode.outerHTML).toEqual('<div key=\"1\"></div>');

        similarFragmentNode.appendChild(childNode);

        // Test that the patch did not change anything
        expect(vnode.patchDom(similarFragmentNode)).toBeFalsy(); // Same text, no update performed

        expect(similarFragmentNode.childNodes.length).toEqual(1); // No children were added

        expect(childNode.outerHTML).toEqual('<div key=\"1\"></div>');

        // Build a DOM node with different child text node
        const differentFragmentNode = document.createDocumentFragment();

        childNode = document.createElement('div');

        (childNode as any).setAttribute('key', '2');

        expect(childNode.outerHTML).toEqual('<div key=\"2\"></div>');

        differentFragmentNode.appendChild(childNode);

        expect(vnode.patchDom(differentFragmentNode)).toBeTruthy(); // Different text, update performed

        expect(differentFragmentNode.childNodes.length).toEqual(1); // No children were added

        expect((differentFragmentNode.childNodes[0] as HTMLElement).outerHTML).toEqual('<div key=\"1\"></div>');
    });

    it('should add a child to the container', () => {

        const vnode = new FragmentNode([
            new ElementNode(
                'span',
                {
                    key: '1'
                },
                []
            )
        ]);

        const containerNode = new ElementNode(
            'div',
            null,
            []
        ).createDom();

        expect(containerNode.outerHTML).toEqual('<div></div>');

        vnode.patchDom(containerNode);

        expect(containerNode.outerHTML).toEqual('<div><span key=\"1\"></span></div>');
    });

    it('should be able to swap the children of the container', () => {

        const vnode = new FragmentNode([
            new ElementNode(
                'span',
                {
                    key: '2'
                },
                []
            ),
            new ElementNode(
                'span',
                {
                    key: '1'
                },
                []
            )
        ]);

        const containerNode = new ElementNode(
            'div',
            null,
            [
                new ElementNode(
                    'span',
                    {
                        key: '1'
                    },
                    []),
                new ElementNode(
                    'span',
                    {
                        key: '2'
                    },
                    [])
            ]
        ).createDom();

        expect(containerNode.outerHTML).toEqual('<div><span key=\"1\"></span><span key=\"2\"></span></div>');

        vnode.patchDom(containerNode);

        expect(containerNode.outerHTML).toEqual('<div><span key=\"2\"></span><span key=\"1\"></span></div>');
    });

    it('should be able to add the extra children to the container correctly ordered', () => {

        const vnode = new FragmentNode([
            new ElementNode(
                'span',
                {
                    key: '1'
                },
                []
            ),
            new ElementNode(
                'span',
                {
                    key: '3'
                },
                []
            ),
            new ElementNode(
                'span',
                {
                    key: '2'
                },
                []
            )
        ]);

        const containerNode = new ElementNode(
            'div',
            null,
            [
                new ElementNode(
                    'span',
                    {
                        key: '1'
                    },
                    []),
                new ElementNode(
                    'span',
                    {
                        key: '2'
                    },
                    [])
            ]
        ).createDom();

        expect(containerNode.outerHTML).toEqual('<div><span key=\"1\"></span><span key=\"2\"></span></div>');

        vnode.patchDom(containerNode);

        expect(containerNode.outerHTML).toEqual('<div><span key=\"1\"></span><span key=\"3\"></span><span key=\"2\"></span></div>');
    });

});