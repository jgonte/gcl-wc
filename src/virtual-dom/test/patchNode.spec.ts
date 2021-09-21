import createNode from "../dom/createNode";
import patchNode from "../dom/patchNode";

describe("patching DOM nodes from old and new virtual nodes tests", () => {

    it('should keep the same node if the nodes have the same tag', () => {

        const oldVNode = {
            tag: 'div',
            attributes: {
                prop1: 'prop1'
            },
            children: []
        };

        const oldNode = createNode(oldVNode);

        const container = document.createElement('div');

        container.appendChild(oldNode);

        const newVNode = {
            tag: 'div',
            attributes: {
                prop1: 'changed prop1'
            },
            children: []
        };

        patchNode(newVNode, oldVNode, container);

        expect(container.innerHTML).toEqual('<div prop1=\"changed prop1\"></div>');
    });

    it('should replace the node if the nodes have different tags', () => {

        const oldVNode = {
            tag: 'div',
            attributes: {
                prop1: 'prop1'
            },
            children: []
        };

        const oldNode = createNode(oldVNode);

        const container = document.createElement('div');

        container.appendChild(oldNode);

        const newVNode = {
            tag: 'span',
            attributes: {
                prop1: 'changed prop1'
            },
            children: []
        };

        patchNode(newVNode, oldVNode, container);

        expect(container.innerHTML).toEqual('<span prop1=\"changed prop1\"></span>');
    });

});