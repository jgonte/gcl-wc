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

    it('should replace the names of non keyed elements', () => {

        let data = [
            {
                name: 'Sarah',
                age: 19
            },
            {
                name: 'Mark',
                age: 31
            },
            {
                name: 'Sasha',
                age: 1
            }
        ];

        let patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span age=\"1\"><!--_$bm_-->Sasha<!--_$em_--></span></div>');

        data = [
            {
                name: 'Dafni',
                age: 19
            },
            {
                name: 'Moshe',
                age: 31
            },
            {
                name: 'Victor',
                age: 1
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span age=\"19\"><!--_$bm_-->Dafni<!--_$em_--></span><span age=\"31\"><!--_$bm_-->Moshe<!--_$em_--></span><span age=\"1\"><!--_$bm_-->Victor<!--_$em_--></span></div>');
    });

    it('should replace the names of keyed elements', () => {

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

        data = [
            {
                id: 1,
                name: 'Dafni',
                age: 19
            },
            {
                id: 2,
                name: 'Moshe',
                age: 31
            },
            {
                id: 3,
                name: 'Victor',
                age: 1
            }
        ];

        let oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\"><!--_$bm_-->Dafni<!--_$em_--></span><span key=\"2\" age=\"31\"><!--_$bm_-->Moshe<!--_$em_--></span><span key=\"3\" age=\"1\"><!--_$bm_-->Victor<!--_$em_--></span></div>');
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

        mountNodes(container, patchingData);

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

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\"><!--_$bm_-->Mark<!--_$em_--></span><span key=\"1\" age=\"19\"><!--_$bm_-->Sarah<!--_$em_--></span></div>');

        // Remove the children
        data = [];

        oldPatchingData = patchingData;

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        updateNodes(container, oldPatchingData, patchingData);

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

        updateNodes(container, oldPatchingData, patchingData);

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

    it('should render a complex object as a value', () => {

        let data = {
            name: "Sarah",
            age: 19,
            description: "Smart and beautiful"
        };

        let patchingData = html`<x-container class="container" record=${data}></x-container>`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\"></x-container></div>");

        expect(container.children[0].attributes[1].value).toEqual("{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}");

        data = {
            name: "Mark",
            age: 31,
            description: "Business man"
        };

        let oldPatchingData = patchingData;

        patchingData = html`<x-container class="container" record=${data}></x-container>`;

        updateNodes(container, oldPatchingData, patchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Business man&quot;}\"></x-container></div>");

        expect(container.children[0].attributes[1].value).toEqual("{\"name\":\"Mark\",\"age\":31,\"description\":\"Business man\"}");
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

        mountNodes(container, containerPatchingData);

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

        updateNodes(container, oldPatchingData, containerPatchingData);

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

        updateNodes(container, oldPatchingData, containerPatchingData);

        expect(container.outerHTML).toEqual("<div><x-container class=\"container\"><!--_$bm_--><!--_$bm_--><span><!--_$bm_-->Mark<!--_$em_--></span><span><!--_$bm_-->Sasha<!--_$em_--></span><span><!--_$bm_-->Sarah<!--_$em_--></span><!--_$em_--><slot></slot><!--_$em_--></x-container></div>");

        // Remove the nested item
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

    it('should attach events to the DOM node and remove the function name from the markup', () => {

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
        };

        let patchingData = html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcl-data-list id-field="id" data=${data.skills}></gcl-data-list>
        </div>`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

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
        };

        let newPatchingData = html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcl-data-list id-field="id" data=${data.skills}></gcl-data-list>
        </div>`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Marketing&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Finance&quot;}]\"></gcl-data-list>\n        </div></div>");

        patchingData = newPatchingData;
    });

    it('should render a complex object with children and undefined attributes', () => {

        let data: any = {
            name: "Sarah",
            description: "Smart and beautiful",
            skills: [
                {
                    id: 1,
                    description: 'Artist'
                },
                {
                    id: 2,
                    //description: 'Medicine'
                }
            ]
        };

        let patchingData = html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcl-data-list id-field="id" data=${data.skills}></gcl-data-list>
        </div>`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_--><!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Artist&quot;},{&quot;id&quot;:2}]\"></gcl-data-list>\n        </div></div>");

        data = {
            name: "Mark",
            age: 31,
            skills: [
                {
                    id: 1,
                    //description: 'Marketing'
                },
                {
                    id: 2,
                    description: 'Finance'
                }
            ]
        };

        let newPatchingData = html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${data.name}</div>
            <div style="background-color: yellow;">${data.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${data.description}</div>
            <gcl-data-list id-field="id" data=${data.skills}></gcl-data-list>
        </div>`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_--><!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1},{&quot;id&quot;:2,&quot;description&quot;:&quot;Finance&quot;}]\"></gcl-data-list>\n        </div></div>");

        patchingData = newPatchingData;
    });

    it('should render a collection of non keyed complex objects with children', () => {

        let data = [
            {
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
            },
            {
                name: "Mark",
                age: 31,
                description: "Hard worker",
                skills: [
                    {
                        id: 3,
                        description: 'Marketing'
                    },
                    {
                        id: 4,
                        description: 'Finance'
                    }
                ]
            }
        ];

        const renderItems = data => data.map(d => html`<div style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${d.name}</div>
            <div style="background-color: yellow;">${d.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${d.description}</div>
            <gcl-data-list id-field="id" data=${d.skills}></gcl-data-list>
        </div>`);

        let patchingData = renderItems(data);

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Artist&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Medicine&quot;}]\"></gcl-data-list>\n        </div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:3,&quot;description&quot;:&quot;Marketing&quot;},{&quot;id&quot;:4,&quot;description&quot;:&quot;Finance&quot;}]\"></gcl-data-list>\n        </div></div>");

        data = [
            {
                name: "Sarah",
                age: 19,
                description: "Smart and awesome",
                skills: [
                    {
                        id: 5,
                        description: 'Makeup'
                    },
                    {
                        id: 2,
                        description: 'Medicine'
                    }
                ]
            },
            {
                name: "Mark",
                age: 31,
                description: "Hard worker and dedicated",
                skills: [
                    {
                        id: 7,
                        description: 'Entrepeneur'
                    },
                    {
                        id: 8,
                        description: 'Salesperson'
                    }
                ]
            }
        ];

        let newPatchingData = renderItems(data);

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and awesome<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:5,&quot;description&quot;:&quot;Makeup&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Medicine&quot;}]\"></gcl-data-list>\n        </div><div style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker and dedicated<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:7,&quot;description&quot;:&quot;Entrepeneur&quot;},{&quot;id&quot;:8,&quot;description&quot;:&quot;Salesperson&quot;}]\"></gcl-data-list>\n        </div></div>");

        patchingData = newPatchingData;
    });

    it('should render a collection of keyed complex objects with children', () => {

        let data = [
            {
                id: 'a',
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
            },
            {
                id: 'b',
                name: "Mark",
                age: 31,
                description: "Hard worker",
                skills: [
                    {
                        id: 3,
                        description: 'Marketing'
                    },
                    {
                        id: 4,
                        description: 'Finance'
                    }
                ]
            }
        ];

        const renderItems = data => data.map(d => html`<div key=${d.id} style="width: 200px; margin: 10px;">
            <div style="background-color: lightgreen; padding: 5px;">${d.name}</div>
            <div style="background-color: yellow;">${d.age}</div>
            <div style="background-color: darkred; color: white; font-weight: bold;">${d.description}</div>
            <gcl-data-list id-field="id" data=${d.skills}></gcl-data-list>
        </div>`);

        let patchingData = renderItems(data);

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><div key=\"a\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and beautiful<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Artist&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Medicine&quot;}]\"></gcl-data-list>\n        </div><div key=\"b\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:3,&quot;description&quot;:&quot;Marketing&quot;},{&quot;id&quot;:4,&quot;description&quot;:&quot;Finance&quot;}]\"></gcl-data-list>\n        </div></div>");

        data = [
            {
                id: 'a',
                name: "Sarah",
                age: 19,
                description: "Smart and awesome",
                skills: [
                    {
                        id: 5,
                        description: 'Makeup'
                    },
                    {
                        id: 2,
                        description: 'Medicine'
                    }
                ]
            },
            {
                id: 'b',
                name: "Mark",
                age: 31,
                description: "Hard worker and dedicated",
                skills: [
                    {
                        id: 7,
                        description: 'Entrepeneur'
                    },
                    {
                        id: 8,
                        description: 'Salesperson'
                    }
                ]
            }
        ];

        let newPatchingData = renderItems(data);

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><div key=\"a\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Smart and awesome<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:5,&quot;description&quot;:&quot;Makeup&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Medicine&quot;}]\"></gcl-data-list>\n        </div><div key=\"b\" style=\"width: 200px; margin: 10px;\">\n            <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Mark<!--_$em_--></div>\n            <div style=\"background-color: yellow;\"><!--_$bm_-->31<!--_$em_--></div>\n            <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Hard worker and dedicated<!--_$em_--></div>\n            <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:7,&quot;description&quot;:&quot;Entrepeneur&quot;},{&quot;id&quot;:8,&quot;description&quot;:&quot;Salesperson&quot;}]\"></gcl-data-list>\n        </div></div>");

        patchingData = newPatchingData;
    });

    it('should render two conditional elements side by side', () => {

        let name: string = "Jorge";

        let age: number = 55;

        let patchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");

        name = "Sarah";

        age = 19;

        let newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--><!--_$bm_--><span style=\"color: green;\">You are too young</span><!--_$em_--></div>");

        patchingData = newPatchingData;

        name = "Jorge";

        age = 45;

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><span style=\"color: green;\">You are too young</span><!--_$em_--></div>");

        name = "Jorge";

        age = 55;

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
            ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
    });

    it('should transition from two conditional elements side by side to a single one', () => {

        let name: string = "Jorge";

        let age: number = 55;

        let patchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}
        ${age < 50 ? html`<span style="color: green;">You are too young</span>` : null}`;

        const container = document.createElement('div');

        mountNodes(container, patchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");

        name = "Sarah";

        let newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><span style=\"color: green;\">Special for Sarah</span><!--_$em_--><!--_$bm_--><!--_$em_--></div>");

        patchingData = newPatchingData;

        name = "Jorge";

        newPatchingData = html`${name === "Sarah" ? html`<span style="color: green;">Special for Sarah</span>` : null}`;

        updateNodes(container, patchingData, newPatchingData);

        expect(container.outerHTML).toEqual("<div><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--></div>");
    });

});