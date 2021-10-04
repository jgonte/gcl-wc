import ElementNode from "../nodes/ElementNode";
import html from "../html";
import TextNode from "../nodes/TextNode";
import FragmentNode from "../nodes/FragmentNode";

describe("html tag template tests", () => {

    it('should add the nested virtual node as a child of the parent one', () => {

        const name = "Sarah";

        const nestedResult = html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        const nestedVNode = nestedResult.vnode as ElementNode;

        expect(nestedVNode.tag).toEqual('x-item');

        expect(nestedVNode.attributes).toEqual({
            class: "item",
        });

        expect((nestedVNode.children[0] as TextNode).text.toString().trim()).toEqual('My name is: Sarah');

        expect(nestedResult.node).toBeDefined();

        const result = html`
            <x-container class="container">       
                ${nestedResult}
            </x-container>
        `;

        const vnode = result.vnode as ElementNode;

        expect(vnode.tag).toEqual('x-container');

        expect(vnode.attributes).toEqual({
            class: "container",
        });

        expect(result.node).toBeDefined();

        const childVNode = vnode.children[0] as ElementNode;

        expect(childVNode).toBe(nestedVNode);

        expect((result.node as HTMLElement).childNodes[1]).toBe(nestedResult.node);
    });

    it('should render a complex object as a value', () => {

        const data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful"
        }

        const result = html`<x-container class="container" record=${data}></x-container>`;

        const vnode = result.vnode as ElementNode;

        expect(vnode.tag).toEqual('x-container');

        expect(vnode.attributes).toEqual({
            class: "container",
            record: "{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}"
        });

    });

    it('should attach events to the DOM node and remove the function name from the markup', () => {

        const handleClick = () => { };

        const result = html`<x-item onClick=${handleClick}></x-item>`;

        const vnode = result.vnode as ElementNode;

        expect(vnode.tag).toEqual('x-item');

        expect(vnode.attributes).toEqual(null); // The handler is not part of the attributes

        expect((result.node as any)._listeners['click']).toEqual([handleClick]);
    });

    it('should render from nested calls to the "html" function', () => {

        function getData() {

            return [
                {
                    name: "Sarah"
                },
                {
                    name: "Mark"
                }
            ];
        }

        const render = () => {

            return getData().map(record => html`<span style="color: red;">${record.name}</span>`);
        };

        const result = html`
                
            ${render()}      
        `;

        const vnode = result.vnode as FragmentNode;

        expect(vnode).toBeInstanceOf(FragmentNode)

        expect(vnode.children.length).toEqual(2);

        let node = result.node;

        expect(node).toBeInstanceOf(DocumentFragment);

        let child = vnode.children[0] as ElementNode;

        expect(child.tag).toEqual('span');

        expect(child.attributes).toEqual({
            style: "color: red;"
        });

        expect(child.children[0]).toEqual({"text": "Sarah"});

    });
});