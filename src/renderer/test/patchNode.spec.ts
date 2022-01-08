import { createNode } from "../createNode";
import { patchNode } from "../patchNode";
import { html } from "../html";

describe("patch node tests", () => {

    it('should make no changes', () => {

        const name = "Sarah";

        const patchingData = html`<span>${name}</span>`;

        const container = document.createElement('div');

        const node = createNode(container, patchingData);

        container.appendChild(node);

        expect(container.outerHTML).toEqual('<div><span>Sarah<!--_$node_--></span></div>');

        const newPatchingData = html`<span>${name}</span>`;

        patchNode(node, newPatchingData);

        expect(container.outerHTML).toEqual('<div><span>Sarah<!--_$node_--></span></div>');
    });

    it('should change the text of the node', () => {

        let name = "Sarah";

        const patchingData = html`<span>${name}</span>`;

        const container = document.createElement('div');

        const node = createNode(container, patchingData);

        container.appendChild(node);

        expect(container.outerHTML).toEqual('<div><span>Sarah<!--_$node_--></span></div>');

        name = "Mark";

        const newPatchingData = html`<span>${name}</span>`;

        patchNode(node, newPatchingData);

        expect(container.outerHTML).toEqual('<div><span>Mark<!--_$node_--></span></div>');
    });

    
});