import html from "../html";
import { mountChildren, mountNode } from "../mount";
import { updateChildren, updateNode } from "../update";

describe("renderer tests", () => {

    it('should render a text node', () => {

        let name = "Sarah";

        let patchingData = html`${name}`;

        const {
            patcher,
            values
        } = patchingData;

        expect(patchingData.rules).toBeNull();

        expect(values).toEqual([name]);

        // Check template
        const {
            content
        } = (patcher as any).template;

        expect(content).toBeInstanceOf(DocumentFragment);

        // Insert a child
        const container = document.createElement('span');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual('<span><!--_$bm_-->Sarah<!--_$em_--></span>');

        // Test that no changes are made if the same value is kept
        name = "Sarah";

        let oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNode(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<span><!--_$bm_-->Sarah<!--_$em_--></span>');

        // Modify the child
        name = "Mark";

        oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNode(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<span><!--_$bm_-->Mark<!--_$em_--></span>');

        // Remove the child
        name = null;

        oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNode(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<span><!--_$bm_--><!--_$em_--></span>');

        // Add a child again to ensure that state is conserved
        name = "Sarah";

        oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNode(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<span><!--_$bm_-->Sarah<!--_$em_--></span>');
    });

    it('should render a collection of non-keyed nodes', () => {

        let data = [
            {
                name: 'Sarah',
                age: 19
            },
            {
                name: 'Mark',
                age: 31
            }
        ];

        let patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        const container = document.createElement('div');

        mountChildren(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');

        // Swap the children
        data = [
            {
                name: 'Mark',
                age: 31
            },
            {
                name: 'Sarah',
                age: 19
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');

        // Remove the children
        data = [];

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div></div>');

        // Add the children again to ensure that state is conserved
        data = [
            {
                name: 'Sarah',
                age: 19
            },
            {
                name: 'Mark',
                age: 31
            }
        ];

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
    });

    it('should render a collection of keyed nodes', () => {

        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            }
        ];

        let patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        const container = document.createElement('div');

        mountChildren(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');

        // Swap the children
        data = [
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 1,
                name: 'Sarah',
                age: 19
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');

        // Remove the children
        data = [];

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div></div>');

        // Add the children again to ensure that state is conserved
        data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            }
        ];

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
    });

    it('should render a collection of keyed nodes swap two first elements', () => {

        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];

        let patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        const container = document.createElement('div');

        mountChildren(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');

        // Swap the children
        data = [
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
    });

    it('should render a collection of keyed nodes swap two last elements', () => {

        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];

        let patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        const container = document.createElement('div');

        mountChildren(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');

        // Swap the children
        data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
    });

    it('should render a collection of keyed nodes swap first and last elements', () => {

        let data = [
            {
                id: 1,
                name: 'Sarah',
                age: 19
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 3,
                name: 'Sasha',
                age: 1
            }
        ];

        let patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        const container = document.createElement('div');

        mountChildren(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');

        // Swap the children
        data = [
            {
                id: 3,
                name: 'Sasha',
                age: 1
            },
            {
                id: 2,
                name: 'Mark',
                age: 31
            },
            {
                id: 1,
                name: 'Sarah',
                age: 19
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateChildren(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');
    });

    it('should render a container with a nested single child', () => {

        let name = "Sarah";
        // Add the nested child element

        let itemPatchingData = html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        let containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        const container = document.createElement('div');

        mountNode(container, containerPatchingData);

        // At this time the node should be created, ensure that the patching data has a reference to it
        const {
            node: containerNode
        } = containerPatchingData;

        expect((containerNode as HTMLElement).outerHTML).toEqual("<x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container>");

        const {
            node: itemNode
        } = itemPatchingData;

        expect(itemNode).toBe(containerNode.childNodes[1]); // it should refer to the same child node

        expect((itemNode as HTMLElement).outerHTML).toEqual("<x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item>");

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");

        // Replace the name of the nested text
        name = "Mark";

        itemPatchingData = html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        let oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><!--_$em_--></x-container></div>");

        // Remove the nested item
        itemPatchingData = null;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
    });

    it('should render a container with nested children', () => {

        // Add the nested child element
        let names = ["Sarah", "Mark", "Sasha"];

        let itemsPatchingData = names.map(name => html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `);

        let containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        const container = document.createElement('div');

        mountNode(container, containerPatchingData);

        // At this time the node should be created, ensure that the patching data has a reference to it
        const {
            node: containerNode
        } = containerPatchingData;

        expect((containerNode as HTMLElement).outerHTML).toEqual("<x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sasha<!--_$em_--></x-item><!--_$em_--></x-container>");

        // Replace the name of the nested text
        names = ["Mark", "Sasha", "Sarah"];

        itemsPatchingData = names.map(name => html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `);

        let oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sasha<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");

        // Remove the nested items
        itemsPatchingData = null;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
    });

    it('should render a collection of children before a slot', () => {

        const container = document.createElement('div');

        // Add empty container
        let itemsPatchingData = null;

        let containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        mountNode(container, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");

        // Add the nested child element
        let names = ["Sarah", "Mark", "Sasha"];

        itemsPatchingData = html`
            ${names.map(name => html`<span>${name}</span>`)}
            <slot></slot>`;

        let oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$bm_--><span><!--_$bm_-->Sarah<!--_$em_--></span><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><!--_$em_--><slot></slot><!--_$em_--></x-container></div>");

        // Replace the name of the nested texts
        names = ["Mark", "Sasha", "Sarah"];

        itemsPatchingData = html`
            ${names.map(name => html`<span>${name}</span>`)}
            <slot></slot>`;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$bm_--><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><span><!--_$bm_-->Sarah<!--_$em_--></span><!--_$em_--><slot></slot><!--_$em_--></x-container></div>");

        // Remove the nested item
        itemsPatchingData = null;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        updateNode(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
    });

    it('should render a different child element', () => {

        const name = "Sarah";

        const patchingData = html`<span>${name}</span>`;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span><!--_$bm_-->Sarah<!--_$em_--></span></div>');

        const newPatchingData = html`<h1>${name}</h1>`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual('<div><h1><!--_$bm_-->Sarah<!--_$em_--></h1></div>');
    });

    it('should render a conditional element', () => {

        let name: string = "Jorge";

        let patchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual('<div><!--_$bm_--><!--_$em_--></div>');

        name = "Sarah";

        let newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--></div>");

        patchingData = newPatchingData;

        name = "Jorge";

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--></div>");
    });

    it('should render two conditional elements side by side', () => {

        let name: string = "Jorge";

        let age: number = 55;

        let patchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");

        name = "Sarah";

        age = 19;

        let newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--><!--_$bm_--><span style=\"color: green;\">You are too young</span><!--_$em_--></div>");

        patchingData = newPatchingData;

        name = "Jorge";

        age = 45;

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><span style=\"color: green;\">You are too young</span><!--_$em_--></div>");

        name = "Jorge";

        age = 55;

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
    });

    //////////////

    // it('should transition from two conditional elements side by side to a single one', () => {

    //     let name: string = "Jorge";

    //     let age: number = 55;

    //     let patchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
    //     ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

    //     const container = document.createElement('div');

    //     mountNode(container, patchingData);

    //     expect(container.outerHTML).toEqual(`<div><!--_$em_-->
    //     <!--_$em_--></div>`);

    //     name = "Sarah";

    //     let newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

    //     updateNode(container, patchingData, newPatchingData);

    //     expect(container.outerHTML).toEqual('<div><span style=\"color: green;\">Special for Sarah</span><!--_$em_--></div>');

    //     patchingData = newPatchingData;

    //     name = "Jorge";

    //     newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

    //     updateNode(container, patchingData, newPatchingData);

    //     expect(container.outerHTML).toEqual('<div><!--_$em_--></div>');
    // });

    it('should render a complex object as a value', () => {

        const data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful"
        }

        const patchingData = html`<x-container class="container" record=${data}></x-container>`;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual('<div><x-container class=\"container\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\"></x-container></div>');

        expect(container.children[0].attributes[1].value).toEqual("{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}");

    });

    it('should attach events to the DOM node and remove the function name from the markup', () => {

        const handleClick = () => { };

        const patchingData = html`<x-item onClick=${handleClick}></x-item>`;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual('<div><x-item></x-item></div>');

        const child = container.children[0];

        expect(child.attributes.length).toEqual(0); // The handler is not part of the attributes

        expect((child as any)._listeners['click']).toEqual([handleClick]);
    });

    it('should render a container with nested child and sibling text', () => {

        const name = 'Sarah';

        const text = 'Some text';

        const patchingData = html`
            <span>
                <gcl-localized-text>Name: ${name}</gcl-localized-text>
                Text: ${text}
            </span>
        `;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual("<div><span>\n                <gcl-localized-text>Name: <!--_$bm_-->Sarah<!--_$em_--></gcl-localized-text>\n                Text: <!--_$bm_-->Some text<!--_$em_--></span></div>");
    });

    //     it('should render from nested calls to the "html" function', () => {

    //         function getData() {

    //             return [
    //                 {
    //                     name: "Sarah"
    //                 },
    //                 {
    //                     name: "Mark"
    //                 }
    //             ];
    //         }

    //         const render = () => {

    //             return getData().map(record => html`<span style="color: red;">${record.name}</span>`);
    //         };

    //         const result = html`

    //             ${render()}      
    //         `;

    //         const vnode = result.vnode as FragmentNode;

    //         expect(vnode).toBeInstanceOf(FragmentNode)

    //         expect(vnode.children.length).toEqual(2);

    //         let node = result.node;

    //         expect(node).toBeInstanceOf(DocumentFragment);

    //         let child = vnode.children[0] as ElementNode;

    //         expect(child.tag).toEqual('span');

    //         expect(child.attributes).toEqual({
    //             style: "color: red;"
    //         });

    //         expect(child.children[0]).toEqual({"text": "Sarah"});

    //     });

    it('should render a node with several children', () => {

        const name = 'Sarah';

        const patchingData = html`
            <gcl-list-item value=1>       
                <span>
                    <gcl-localized-text>Name: ${name}</gcl-localized-text>
                    Some text
                </span>
                <gcl-localized-text>Date of Birth: 6/26/2003</gcl-localized-text>

                <gcl-localized-text>Reputation: 10</gcl-localized-text>

                <gcl-localized-text>Description: Very beautiful and smart</gcl-localized-text>
                <img style="width: 64px; height: 64px; border-radius: 50%;" src=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z />
            </gcl-list-item>
        `;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual("<div><gcl-list-item value=\"1\">       \n                <span>\n                    <gcl-localized-text>Name: <!--_$bm_-->Sarah<!--_$em_--></gcl-localized-text>\n                    Some text\n                </span>\n                <gcl-localized-text>Date of Birth: 6/26/2003</gcl-localized-text>\n\n                <gcl-localized-text>Reputation: 10</gcl-localized-text>\n\n                <gcl-localized-text>Description: Very beautiful and smart</gcl-localized-text>\n                <img style=\"width: 64px; height: 64px; border-radius: 50%;\" src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z\"/>\n            </gcl-list-item></div>");

        // const vnode = markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true }).vnode as ElementNode;

        // expect(vnode.tag).toEqual('gcl-list-item');

        // expect(vnode.attributes).toMatchObject({
        //     value: '1'
        // });

        // expect(vnode.children.length).toEqual(5);

        // const spanVNode = vnode.children[0] as ElementNode;

        // expect(spanVNode.tag).toEqual('span');

        // const gclTextVNode = spanVNode.children[0] as ElementNode;

        // expect(gclTextVNode.tag).toEqual('gcl-localized-text');

        // const textVNode = gclTextVNode.children[0] as TextNode;

        // expect(textVNode).toEqual({ "text": "Name: Sarah" });

        // const imgVNode = vnode.children[4] as ElementNode;

        // expect(imgVNode.tag).toEqual('img');

        // expect(imgVNode.attributes).toMatchObject({
        //     src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z",
        //     style: "width: 64px; height: 64px; border-radius: 50%;",
        // });
    });

    //     it('should throw an error when there is a script tag but the options are not set to allowScripts', () => {

    //         const markup =
    //             `
    //             <gcl-list-item value=1>       
    //                 <span><gcl-localized-text>Name: Sarah</gcl-localized-text>Some text</span>
    //                 <script></script>
    //                 <gcl-localized-text>Date of Birth: 6/26/2003</gcl-localized-text>
    //                 <gcl-localized-text>Reputation: 10</gcl-localized-text>
    //                 <gcl-localized-text>Description: Very beautiful and smart</gcl-localized-text>
    //                 <img style="width: 64px; height: 64px; border-radius: 50%;" src=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z />
    //             </gcl-list-item>

    //             `;

    //         expect(() => markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true }))
    //             .toThrowError(new Error('Script elements are not allowed unless the allowScripts option is set to true'));
    //     });

    //     it('should create a virtual node tree from html markup allowing scripts', () => {

    //         const markup =
    //             `<gcl-list-item value=1>  
    //         <script></script>     
    //         <span><gcl-localized-text>Name: Sarah</gcl-localized-text>Some text</span>
    //         <gcl-localized-text>Date of Birth: 6/26/2003</gcl-localized-text>
    //         <gcl-localized-text>Reputation: 10</gcl-localized-text>
    //         <gcl-localized-text>Description: Very beautiful and smart</gcl-localized-text>
    //         <img style="width: 64px; height: 64px; border-radius: 50%;" src=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z />
    //     </gcl-list-item>`;

    //         const vnode = markupToVirtualNode(markup, 'html',
    //             {
    //                 excludeTextWithWhiteSpacesOnly: true,
    //                 allowScripts: true
    //             }).vnode as ElementNode;

    //         expect(vnode.tag).toEqual('gcl-list-item');

    //         expect(vnode.attributes).toMatchObject({
    //             value: '1'
    //         });

    //         expect(vnode.children.length).toEqual(6);

    //         const scriptVNode = vnode.children[0] as ElementNode;

    //         expect(scriptVNode.tag).toEqual('script');
    //     });

    //     it('should create a virtual node tree from html markup with a collection of nodes', () => {

    //         const markup =
    //             `  
    //         <span><gcl-localized-text>Name: Sarah</gcl-localized-text>Some text</span>
    //         <gcl-localized-text>Date of Birth: 6/26/2003</gcl-localized-text>
    //         <gcl-localized-text>Reputation: 10</gcl-localized-text>
    //         <gcl-localized-text>Description: Very beautiful and smart</gcl-localized-text>
    //         <img style="width: 64px; height: 64px; border-radius: 50%;" src=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z />
    //     `;

    //         const vnode = markupToVirtualNode(markup, 'html',
    //             {
    //                 excludeTextWithWhiteSpacesOnly: true
    //             }).vnode as ElementNode;

    //         //expect(vnode).toBeInstanceOf(FragmentNode);

    //         // expect(vnode.attributes).toMatchObject({
    //         //     value: '1'
    //         // });

    //         expect(vnode.children.length).toEqual(5);

    //         expect((vnode.children[0] as ElementNode).tag).toEqual('span');

    //         expect((vnode.children[1] as ElementNode).tag).toEqual('gcl-localized-text');

    //         expect((vnode.children[2] as ElementNode).tag).toEqual('gcl-localized-text');

    //         expect((vnode.children[3] as ElementNode).tag).toEqual('gcl-localized-text');

    //         expect((vnode.children[4] as ElementNode).tag).toEqual('img');
    //     });

    //     // DOMParser for xml is not implemented in HappyDom yet
    //     // it('should create a node tree from xml markup', () => {

    //     //     const markup = 
    //     // `<gcl-list-item value=1>       
    //     //     <gcl-localized-text>Name: Sarah</gcl-localized-text>
    //     //     <gcl-localized-text>Date of Birth: 6/26/2003</gcl-localized-text>
    //     //     <gcl-localized-text>Reputation: 10</gcl-localized-text>
    //     //     <gcl-localized-text>Description: Very beautiful and smart</gcl-localized-text>
    //     //     <img style="width: 64px; height: 64px; border-radius: 50%;" src=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z />
    //     // </gcl-list-item>`;

    //     //     const vnode = markupToVirtualNode(markup, 'xml', { excludeTextWithWhiteSpacesOnly: true}) as ElementNode;

    //     // });
    // return fields.map(field => {

    //     return (
    //         html`<gcl-data-cell field=${field} record=${record} key=${field}></gcl-data-cell>`
    //     );
    // });

    // it('should render a string attribute', () => {

    //     let name = "Sarah";

    //     const node = html`<span name=${name}></span>`;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Sarah\"></span>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values).toEqual([name]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"_$attr:name\"></span>');

    //     expect(rules.length).toEqual(1);

    //     const rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('name');

    //     expect(rule.node).toEqual(node.childNodes[0]);
    // });

    // it('should render a complex attribute', () => {

    //     const data = [
    //         {
    //             name: 'Sarah',
    //             age: 19
    //         },
    //         {
    //             name: 'Mark',
    //             age: 31
    //         }
    //     ];

    //     const node = html`<span data=${data}></span>`;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span data=\"[{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19},{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31}]\"></span>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values).toEqual([data]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span data=\"_$attr:data\"></span>');

    //     expect(rules.length).toEqual(1);

    //     const rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('data');

    //     expect(rule.node).toEqual(node.childNodes[0]);
    // });

    // it('should render attach an event handler', () => {

    //     const handler = () => {};

    //     const node = html`<span onClick=${handler}></span>`;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span></span>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;
    //     expect(values).toEqual([handler]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span onclick=\"_$evt:onClick\"></span>');

    //     expect(rules.length).toEqual(1);

    //     const rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_EVENT);

    //     expect(rule.name).toEqual('onClick');

    //     expect(rule.node).toEqual(node.childNodes[0]);
    // });

    // it('should render more that one attribute', () => {

    //     let name = "Sarah";

    //     let age = 19;

    //     const node = html`<span name=${name} age=${age}></span>`;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Sarah\" age=\"19\"></span>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values).toEqual([name, age]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"_$attr:name\" age=\"_$attr:age\"></span>');

    //     expect(rules.length).toEqual(2);

    //     let rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('name');

    //     expect(rule.node).toEqual(node.childNodes[0]);

    //     rule = rules[1];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('age');

    //     expect(rule.node).toEqual(node.childNodes[0]);
    // });

    // it('should render one attribute and text child', () => {

    //     let age = 19;

    //     let name = "Sarah";

    //     const node = html`<span age=${age}>${name}</span>` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah<!--_$em_--></span>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values).toEqual([age, name]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age="_$attr:age"><!--_$em_--></span>');

    //     expect(rules.length).toEqual(2);

    //     let rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('age');

    //     expect(rule.node).toEqual(node.childNodes[0]);

    //     rule = rules[1];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

    //     expect(rule.node).toEqual(node.childNodes[0].childNodes[1]);
    // });

    // it('should render more than one element', () => {

    //     let age = 19;

    //     let name = "Sarah";

    //     let style = "background-color:green;"

    //     const node = html`<span age=${age}>${name}</span><style>${style}</style>` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah<!--_$em_--></span>');

    //     expect((node.childNodes[1] as HTMLStyleElement).outerHTML).toEqual('<style>background-color:green;<!--_$em_--></style>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values).toEqual([age, name, style]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age="_$attr:age"><!--_$em_--></span>');

    //     expect((content.childNodes[1] as HTMLElement).outerHTML).toEqual('<style><!--_$em_--></style>');

    //     expect(rules.length).toEqual(3);

    //     let rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('age');

    //     expect(rule.node).toEqual(node.childNodes[0]);

    //     rule = rules[1];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

    //     expect(rule.node).toEqual(node.childNodes[0].childNodes[1]);

    //     rule = rules[2];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

    //     expect(rule.node).toEqual(node.childNodes[1].childNodes[1]);
    // });

    // it('should render more a relatively complex element', () => {

    //     let age = 19;

    //     let name = "Sarah";

    //     let style = "background-color:green;"

    //     const node = html`<div><span age=${age}>${name}</span><style>${style}</style></div>` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$em_--></span><style>background-color:green;<!--_$em_--></style></div>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values).toEqual([age, name, style]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"_$attr:age\"><!--_$em_--></span><style><!--_$em_--></style></div>');

    //     expect(rules.length).toEqual(3);

    //     let rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

    //     expect(rule.name).toEqual('age');

    //     expect(rule.node).toEqual(node.childNodes[0].childNodes[0]);

    //     rule = rules[1];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

    //     expect(rule.node).toEqual(node.childNodes[0].childNodes[0].childNodes[1]);

    //     rule = rules[2];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

    //     expect(rule.node).toEqual(node.childNodes[0].childNodes[1].childNodes[1]);
    // });

    // it('should render a collection of non keyed children, empty container', () => {

    //     const data = [
    //         {
    //             name: 'Sarah',
    //             age: 19,
    //             style: "background-color:green;"
    //         },
    //         {
    //             name: 'Mark',
    //             age: 31,
    //             style: "background-color:yelow;"
    //         }
    //     ];

    //     const children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const node = html`${children}` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$em_--></span><style>background-color:green;<!--_$em_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$em_--></span><style>background-color:yelow;<!--_$em_--></style></div>');

    //     const {
    //         patcher,
    //         rules,
    //         values
    //     } = (node as any)._$patchingData;

    //     expect(values[0]).toEqual([node.childNodes[0], node.childNodes[1]]);

    //     const {
    //         content
    //     } = patcher.template;

    //     expect(content).toBeInstanceOf(DocumentFragment);

    //     expect(content.childNodes[0].textContent).toEqual('_$node_');

    //     expect(rules.length).toEqual(1);

    //     let rule = rules[0];

    //     expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

    //     expect(rule.node).toEqual(node.childNodes[0]);
    // });

    it('should render a complex object with children', () => {

        let data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful",
            skills: [
                {
                    id: 1,
                    description: 'Artist'
                },
                {
                    id: 2,
                    description: 'Medicine'
                }
            ]
        }

        let patchingData = html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcl-data-list id-field="id" data=${data.skills}></gcl-data-list>
        </div>`;

        const container = document.createElement('div');

        mountNode(container, patchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Artist&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Medicine&quot;}]\"></gcl-data-list>\n        </div></div>");

        data = {
            name: "Mark",
            age: 31,
            description: "Hard worker",
            skills: [
                {
                    id: 1,
                    description: 'Marketing'
                },
                {
                    id: 2,
                    description: 'Finance'
                }
            ]
        }

        let newPatchingData = html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcl-data-list id-field="id" data=${data.skills}></gcl-data-list>
        </div>`;

        updateNode(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Marketing&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Finance&quot;}]\"></gcl-data-list>\n        </div></div>");

        patchingData = newPatchingData;
    });

});
