import { createNode } from "../createNode";
import { nodeMarker } from "../createTemplate";
import { html } from "../renderer";

describe("create node tests", () => {

    it('should create a text node', () => {

        const name = 'Sarah';

        const patchingData = html`${name}`;

        const node = createNode(patchingData) as DocumentFragment;

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

        const node = createNode(patchingData) as DocumentFragment;

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

});