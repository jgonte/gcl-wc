import createNode from "../dom/createNode";
import patchNode from "../dom/patchNode";
// import patchNode from "../patchNode";

describe("patching DOM nodes from old and new virtual nodes tests", () => {

    // it('should keep the same node if the nodes have the same tag', () => {

    //     const oldVNode = {
    //         tag: 'div',
    //         attributes: {
    //             prop1: 'prop1'
    //         },
    //         children: []
    //     };

    //     const oldNode = createNode(oldVNode);

    //     const container = document.createElement('div');

    //     container.appendChild(oldNode);

    //     const newVNode = {
    //         tag: 'div',
    //         attributes: {
    //             prop1: 'changed prop1'
    //         },
    //         children: []
    //     };

    //     createNode(newVNode); // Create the DOM node for that virtual node

    //     patchNode(newVNode, oldVNode, container);

    //     expect(container.innerHTML).toEqual('<div prop1=\"changed prop1\"></div>');
    // });

    // it('should replace the node if the nodes have different tags', () => {

    //     const oldVNode = {
    //         tag: 'div',
    //         attributes: {
    //             prop1: 'prop1'
    //         },
    //         children: []
    //     };

    //     const oldNode = createNode(oldVNode);

    //     const container = document.createElement('div');

    //     container.appendChild(oldNode);

    //     expect(container.innerHTML).toEqual('<div prop1=\"prop1\"></div>');

    //     const newVNode = {
    //         tag: 'span',
    //         attributes: {
    //             prop1: 'changed prop1'
    //         },
    //         children: []
    //     };

    //     createNode(newVNode); // Create the DOM node for that virtual node

    //     patchNode(newVNode, oldVNode, container);

    //     expect(container.innerHTML).toEqual('<span prop1=\"changed prop1\"></span>');
    // });

    
    it('should add a new child to the node if a child was added to the virtual node after being created', () => {

        const vnode = {
            tag: 'div',
            attributes: {
                prop1: 'prop1'
            },
            children: []
        };

        const node = createNode(vnode) as HTMLElement;

        expect(node.outerHTML).toEqual('<div prop1=\"prop1\"></div>');

        const childVNode = {
            tag: 'span',
            attributes: {
                prop1: 'child prop1'
            },
            children: []
        };

        vnode.children.push(childVNode); // Add a child to the original vnode

        patchNode(vnode);

        expect(node.outerHTML).toEqual('<div prop1=\"prop1\"><span prop1=\"child prop1\"></span></div>');
    });

    it('should add a new child to the node if a child was added to the virtual node after being created', () => {

        const vnode = {
            tag: null,
            attributes: null,
            children: [
                {
                    tag: 'div',
                    attributes: {
                        prop1: 'prop1'
                    },
                    children: []
                }
            ]
        };

        const node = createNode(vnode) as HTMLElement;

        const container = document.createElement('div');

        container.appendChild(node);

        expect(container.innerHTML).toEqual('<div prop1=\"prop1\"></div>');

        const childVNode = {
            tag: 'span',
            attributes: {
                prop1: 'child prop1'
            },
            children: []
        };

        vnode.children.push(childVNode); // Add a child to the original vnode

        patchNode(vnode, container);

        expect(container.innerHTML).toEqual('<div prop1=\"prop1\"></div><span prop1=\"child prop1\"></span>');
    });

});