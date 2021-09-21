import html from "../html";

describe("html tag template tests", () => {

    it('should add the nested virtual node as a child of the parent one', () => {

        const nestedVNode = {
            tag: 'x-item',
            attributes: {
                class: "item"
            },
            children: []
        };

        const vnode = html`
            <x-container class="container">       
                ${nestedVNode}
            </x-container>
        `;

        expect(vnode).toEqual({
            tag: 'x-container',
            attributes: {
                class: "container",
            },
            children: [
                {
                    tag: 'x-item',
                    attributes: {
                        class: 'item'
                    },
                    children: []
                }
            ]
        });

    });

});