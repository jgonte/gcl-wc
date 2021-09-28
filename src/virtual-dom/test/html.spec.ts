import html from "../html";
import { VirtualNode } from "../interfaces";

describe("html tag template tests", () => {

    it('should add the nested virtual node as a child of the parent one', () => {

        const name = "Sarah";

        const nestedVNode = html`
            <x-item class="item">       
                My name is: ${name}
            </x-item>
        ` as VirtualNode;

        expect(nestedVNode.tag).toEqual('x-item');

        expect(nestedVNode.attributes).toEqual({
            class: "item",
        });

        expect(nestedVNode.children[0].trim()).toEqual('My name is: Sarah');

        expect(nestedVNode.$node).toBeDefined();

        const vnode = html`
            <x-container class="container">       
                ${nestedVNode}
            </x-container>
        ` as VirtualNode;

        expect(vnode.tag).toEqual('x-container');

        expect(vnode.attributes).toEqual({
            class: "container",
        });

        expect(vnode.$node).toBeDefined();

        const childVNode = vnode.children[0] as VirtualNode;

        expect(childVNode).toBe(nestedVNode);

        expect(childVNode.$node).toBe(nestedVNode.$node);
    });

    it('should render a complex object as a value', () => {

        const data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful"
        }

        const vnode = html`<x-container class="container" record=${data}></x-container>` as VirtualNode;

        expect(vnode.tag).toEqual('x-container');

        expect(vnode.attributes).toEqual({
            class: "container",
            record: "{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}"
        });

    });

    it('should attach events to the DOM node and remove the function name from the markup', () => {

        const handleClick = () => {};

        const vnode = html`<x-item onClick=${handleClick}></x-item>` as VirtualNode;

        expect(vnode.tag).toEqual('x-item');

        expect(vnode.attributes).toEqual(null); // The handler is not part of the attributes

        expect((vnode.$node as any)._listeners['click']).toEqual([handleClick]);
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

        const vnode = html`
                
            ${render()}      
        ` as VirtualNode;

        expect(vnode.tag).toEqual(null);

        expect(vnode.attributes).toEqual({});

        expect(vnode.children.length).toEqual(2);

        let node = vnode.$node;

        expect(node).toBeInstanceOf(DocumentFragment);

        let child = vnode.children[0];

        expect(child.tag).toEqual('span');

        expect(child.attributes).toEqual({
            style: "color: red;"
        });

        expect(child.children[0]).toEqual("Sarah");

    });
});