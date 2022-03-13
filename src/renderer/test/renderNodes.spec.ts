import { NodePatcherRuleTypes } from "../createTemplate";
import html from "../html";
import { mountNodes } from "../mountNodes";
import { updateNodes } from "../updateNodes";

describe("render nodes tests", () => {

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

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah<!--_$em_--></span>");

        // Test that no changes are made if the same value is kept
        name = "Sarah";

        let oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah<!--_$em_--></span>");

        // Modify the child
        name = "Mark";

        oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Mark<!--_$em_--></span>");

        // Remove the child
        name = null;

        oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<span><!--_$bm_--><!--_$em_--></span>");

        // Add a child again to ensure that state is conserved
        name = "Sarah";

        oldPatchingData = patchingData;

        patchingData = html`${name}`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<span><!--_$bm_-->Sarah<!--_$em_--></span>");
    });

    it('should render component with 3 level rendering', () => {

        const renderItem = record => {

            return html`${record.description}`;
        };

        const renderItems = data => {

            return data.map(record => {

                return html`<li key=${record.id}>
                    <gcl-selectable select-value=${record}>${renderItem(record)}</gcl-selectable>
                </li>`;
            });
        };

        let data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];

        let patchingData = html`<ul>
            ${renderItems(data)}
        </ul>`;

        const {
            patcher
        } = patchingData;

        expect(patchingData.rules).toBeNull();

        // Check template
        const {
            content
        } = (patcher as any).template;

        expect(content).toBeInstanceOf(DocumentFragment);

        // Insert children
        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><li key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><!--_$em_--></ul></div>");

        const values = patchingData.values[0];

        const value1 = values[0];

        // Ensure there is a node attached to the child value
        expect(value1.node.nodeName).toEqual('LI');

        const nestedValue1 = value1.values[2];

        // Ensure there is a node attached to the child value
        expect(nestedValue1.node.nodeName).toEqual('#comment');

        const value2 = values[1];

        // Ensure there is a node attached to the child value
        expect(value2.node.nodeName).toEqual('LI');

        const nestedValue2 = value2.values[2];

        // Ensure there is a node attached to the child value
        expect(nestedValue2.node.nodeName).toEqual('#comment');

        // Remove the first item
        data = [
            {
                id: 2,
                description: "Item 2"
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = html`<ul>
            ${renderItems(data)}
        </ul>`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><!--_$em_--></ul></div>");

        // Prepend item 1
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];

        oldPatchingData = patchingData;

        patchingData = html`<ul>
            ${renderItems(data)}
        </ul>`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><li key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><!--_$em_--></ul></div>");

        // Remove all the items
        data = [];

        oldPatchingData = patchingData;

        patchingData = html`<ul>
            ${renderItems(data)}
        </ul>`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><!--_$em_--></ul></div>");

        // Add the items again
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];

        oldPatchingData = patchingData;

        patchingData = html`<ul>
            ${renderItems(data)}
        </ul>`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><ul><!--_$bm_--><li key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><li key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </li><!--_$em_--></ul></div>");

    });

    it('should render an array of components', () => {

        const renderItem = record => {

            return html`${record.description}`;
        };

        const renderItems = data => {

            return data.map(record => {

                return html`<span key=${record.id}>
                    <gcl-selectable select-value=${record}>${renderItem(record)}</gcl-selectable>
                </span>`;
            });
        };

        let data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];

        let patchingData = renderItems(data);

        expect(patchingData.length).toEqual(2);

        // Insert a child
        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><span key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span><span key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span></div>");

        let value1 = patchingData[0];

        // Ensure there is a node attached to the child value
        expect(value1.node.nodeName).toEqual('SPAN');

        let nestedValue1 = value1.values[2];

        // Ensure there is a node attached to the child value
        expect(nestedValue1.node.nodeName).toEqual('#comment');

        const value2 = patchingData[1];

        // Ensure there is a node attached to the child value
        expect(value2.node.nodeName).toEqual('SPAN');

        const nestedValue2 = value2.values[2];

        // Ensure there is a node attached to the child value
        expect(nestedValue2.node.nodeName).toEqual('#comment');

        // Remove the first item
        data = [
            {
                id: 2,
                description: "Item 2"
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = renderItems(data);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span></div>");

        value1 = patchingData[0];

        // Ensure there is a node attached to the child value
        expect(value1.node.nodeName).toEqual('SPAN');

        nestedValue1 = value1.values[2];

        // Ensure there is a node attached to the child value
        expect(nestedValue1.node.nodeName).toEqual('#comment');

        // Prepend item 1
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];

        oldPatchingData = patchingData;

        patchingData = renderItems(data);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span><span key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span></div>");

        // Remove all the items
        data = [];

        oldPatchingData = patchingData;

        patchingData = renderItems(data);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div></div>");

        // Add the items again
        data = [
            {
                id: 1,
                description: "Item 1"
            },
            {
                id: 2,
                description: "Item 2"
            }
        ];

        oldPatchingData = patchingData;

        patchingData = renderItems(data);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span><span key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span></div>");

        // Swap the items
        data = [
            {
                id: 2,
                description: "Item 2"
            },
            {
                id: 1,
                description: "Item 1"
            }
        ];

        oldPatchingData = patchingData;

        patchingData = renderItems(data);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span key=\"2\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span><span key=\"1\">\n                    <gcl-selectable select-value=\"{&quot;id&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></gcl-selectable>\n                </span></div>");
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

        mountNodes(container, patchingData);

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

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>");

        // Remove the children
        data = [];

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div></div>");

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

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>");

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

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>");
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

        mountNodes(container, patchingData);

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

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');
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

        mountNodes(container, patchingData);

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

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');
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

        mountNodes(container, patchingData);

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

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span></div>');
    });

    it('should render a container with a nested single child', () => {

        // Add the nested child element
        let name = "Sarah";

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

        mountNodes(container, containerPatchingData);

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

        updateNodes(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><!--_$em_--></x-container></div>");

        // Remove the nested item
        itemPatchingData = null;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        updateNodes(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");

        // Add the nested child element again
        name = "Sarah";

        itemPatchingData = html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        updateNodes(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");
    });

    it('should render a different child element', () => {

        const name = "Sarah";

        const patchingData = html`<span>${name}</span>`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span><!--_$bm_-->Sarah<!--_$em_--></span></div>');

        const newPatchingData = html`<h1>${name}</h1>`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual('<div><h1><!--_$bm_-->Sarah<!--_$em_--></h1></div>');
    });

    it('should render a conditional element', () => {

        let name: string = "Jorge";

        let patchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual('<div><!--_$bm_--><!--_$em_--></div>');

        name = "Sarah";

        let newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--></div>");

        patchingData = newPatchingData;

        name = "Jorge";

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--></div>");
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

        mountNodes(container, containerPatchingData);

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

        updateNodes(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><x-item class=\"item\">\n                My name is: <!--_$bm_-->Mark<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sasha<!--_$em_--></x-item><x-item class=\"item\">\n                My name is: <!--_$bm_-->Sarah<!--_$em_--></x-item><!--_$em_--></x-container></div>");

        // Remove the nested items
        itemsPatchingData = null;

        oldPatchingData = containerPatchingData;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemsPatchingData}
            </x-container>
        `;

        updateNodes(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$em_--></x-container></div>");
    });

    it('should attach an event handler', () => {

        const handleClick = () => { };

        const patchingData = html`<span onClick=${handleClick}></span>`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><span></span></div>");

        const {
            patcher,
            rules,
            values
        } = patchingData;

        expect(values).toEqual([handleClick]);

        const {
            content
        } = patcher.template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span onclick=\"_$evt:onClick\"></span>');

        expect(rules.length).toEqual(1);

        const rule = rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_EVENT);

        expect(rule.name).toEqual('onClick');

        const child = container.children[0];

        expect(rule.node).toEqual(child);

        expect(child.attributes.length).toEqual(0); // The handler is not part of the attributes

        expect((child as any)._listeners['click']).toEqual([handleClick]);
    });

});