import NodePatcher, { NodePatcherRuleTypes } from "../NodePatcher";

describe("patching a DOM node test", () => {

    it("should patch a text node", () => {

        const oldValue = 'old text';

        const node = new Text(oldValue);

        const patcher = new NodePatcher([
            {
                type: NodePatcherRuleTypes.PATCH_TEXT
            }
        ]);

        const newValue = 'new text';

        patcher.patch(node, [oldValue], [newValue]);

        expect(node.textContent).toEqual(newValue);
    });

    it("should patch an attribute in an element", () => {

        const name = 'attr1';

        const oldValue = 'old value';

        const node = document.createElement('span');

        node.setAttribute(name, oldValue);

        const patcher = new NodePatcher([
            {
                type: NodePatcherRuleTypes.PATCH_ATTRIBUTE,
                name
            }
        ]);

        const newValue = 'new value';

        patcher.patch(node, [oldValue], [newValue]);

        expect(node.getAttribute(name)).toEqual(newValue);
    });

    it("should add the children of an element", () => {

        const node = document.createElement('div');

        const patcher = new NodePatcher([
            {
                type: NodePatcherRuleTypes.PATCH_CHILDREN
            }
        ]);

        const oldChildren = [];

        const child1 = document.createTextNode('Sarah');

        const child2 = document.createElement('style');

        const newChildren = [
            child1,
            child2
        ];

        patcher.patch(node, oldChildren, newChildren);

        expect(node.childNodes[0]).toEqual(child1);

        expect(node.childNodes[1]).toEqual(child2);
    });

    it("should remove the children of an element", () => {

        const node = document.createElement('div');

        const child1 = document.createTextNode('Sarah');

        node.insertBefore(child1, null);

        const child2 = document.createElement('style');

        node.insertBefore(child2, null);

        expect(node.childNodes.length).toEqual(2);

        const patcher = new NodePatcher([
            {
                type: NodePatcherRuleTypes.PATCH_CHILDREN
            }
        ]);

        const oldChildren = [
            child1,
            child2
        ];

        const newChildren = [];

        patcher.patch(node, oldChildren, newChildren);

        expect(node.childNodes.length).toEqual(0);
    });

    it("should swap the non-keyed children of an element", () => {

        const node = document.createElement('div');

        const child1 = document.createTextNode('Sarah');

        node.insertBefore(child1, null);

        const child2 = document.createElement('style');

        node.insertBefore(child2, null);

        expect(node.childNodes.length).toEqual(2);

        const patcher = new NodePatcher([
            {
                type: NodePatcherRuleTypes.PATCH_CHILDREN
            }
        ]);

        const oldChildren = [
            child1,
            child2
        ];

        const child3 = document.createElement('style');

        const child4 = document.createTextNode('Sarah');

        const newChildren = [
            child3,
            child4
        ];

        patcher.patch(node, oldChildren, newChildren);

        expect(node.childNodes[0]).toEqual(child3);

        expect(node.childNodes[1]).toEqual(child4);
    });

});