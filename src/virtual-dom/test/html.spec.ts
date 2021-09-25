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

        const vnode = html`<x-container class="container" record='${data}'></x-container>` as VirtualNode;

        expect(vnode.tag).toEqual('x-container');

        expect(vnode.attributes).toEqual({
            class: "container",
            record: "{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}"
        });

    });

    it('should render a complex object as a value', () => {

        const getData = () => {

            return {
                name: "Sarah",
                age: 19,
                description: "Smart and beautiful"
            };
        }; 

        const vnode = html`<x-container class="container" record='${getData}'></x-container>` as VirtualNode;

        expect(vnode.tag).toEqual('x-container');

        expect(vnode.attributes).toEqual({
            class: "container",
            record: "{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}"
        });

    });
});