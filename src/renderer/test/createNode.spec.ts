import { createNode } from "../createNode";
import { nodeMarker } from "../createTemplate";
import { html } from "../renderer";

describe("create node tests", () => {

    it('should create a text node', () => {

        const name = 'Sarah';

        const patchingData = html`${name}`;

        const node = createNode(patchingData);

        expect(node.nodeType).toEqual(Node.DOCUMENT_FRAGMENT_NODE);

        const {
            childNodes
        } = node;

        expect((node as any)._$patchingData).toEqual(patchingData);

        const text = childNodes[0] as Text;

        expect(text.nodeType).toEqual(Node.TEXT_NODE);

        expect(text.textContent).toEqual('Sarah');

        const comment = childNodes[1] as Comment;

        expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

        expect(comment.data).toEqual(nodeMarker);
    });

    it('should create an element with a child text node', () => {

        const name = 'Sarah';

        const patchingData = html`<span>${name}</span>`;

        const node = createNode(patchingData);

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as any)._$patchingData).toEqual(patchingData);

        const {
            childNodes
        } = node;

        const text = childNodes[0] as Text;

        expect(text.nodeType).toEqual(Node.TEXT_NODE);

        expect(text.textContent).toEqual('Sarah');

        const comment = childNodes[1] as Comment;

        expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

        expect(comment.data).toEqual(nodeMarker);
    });

    it('should create an element with attributes', () => {

        const record = { "name": "Sarah", "age": "19", "description": "Beautiful and smart" };

        const field = 'name';

        const patchingData = html`
        <gcl-data-cell 
            field=${field} 
            record=${record} 
            key=${field}>
        </gcl-data-cell>`;

        const node = createNode(patchingData) as HTMLElement;

        // Verify the patching data
        const {
            node: newNode,
            patcher,
            rules,
            values
        } = patchingData;

        expect(node).toBe(newNode);

        expect(rules.length).toEqual(3);

        expect(values).toEqual([
            "name",
            {
                name: "Sarah",
                age: "19",
                description: "Beautiful and smart",
            },
            "name",
        ]);

        const {
            templateString,
            template,
            keyIndex,
        } = patcher;

        expect(templateString).toEqual('<gcl-data-cell \n            field=\"_$attr:field\" \n            record=\"_$attr:record\" \n            key=\"_$attr:key\"></gcl-data-cell>');

        const {
            childNodes: templateChildren
        } = template.content;

        expect(templateChildren.length).toEqual(1);

        expect(keyIndex).toEqual(2);

        // Verify the nodes
        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as any)._$patchingData).toEqual(patchingData);

        const {
            childNodes
        } = node;

        expect(childNodes.length).toEqual(0);

        expect(node.attributes.length).toEqual(3);

        expect(node.getAttribute('field')).toEqual('name');

        expect(node.getAttribute('record')).toEqual(JSON.stringify(record));

        expect(node.getAttribute('key')).toEqual('name');
    });

});