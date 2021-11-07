import { NodePatcherRuleTypes } from "../NodePatcher";
import { render } from "../render";
import { html } from "../renderer";

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

        expect(content.childNodes[0].textContent).toEqual('_$node_');

        // Insert a child
        const container = document.createElement('span');

        render(container, undefined, patchingData);

        expect(container.outerHTML).toEqual('<span>Sarah<!--_$node_--></span>');

        const {
            rules
        } = (container as any)._$patchingData;

        // Check there are compiled rules
        expect(rules.length).toEqual(1);

        const rule = rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_NODE);

        expect(rule.node).toEqual(container.childNodes[1]);

        // Modify the child
        name = "Mark";

        patchingData = html`${name}`;

        render(container, container, patchingData);

        expect(container.outerHTML).toEqual('<span>Mark<!--_$node_--></span>');

        // Remove the child
        name = null;

        patchingData = html`${name}`;

        render(container, container, patchingData);

        expect(container.outerHTML).toEqual('<span><!--_$node_--></span>');

        // Add a child again to ensure that state is conserved
        name = "Sarah";

        patchingData = html`${name}`;

        render(container, container, patchingData);

        expect(container.outerHTML).toEqual('<span>Sarah<!--_$node_--></span>');
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

        render(container, undefined, patchingData as any);

        expect(container.outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><span age=\"31\">Mark<!--_$node_--></span></div>');

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

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        render(container, container, patchingData as any);

        expect(container.outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><span age=\"19\">Sarah<!--_$node_--></span></div>');

        // Remove the children
        data = [];

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        render(container, container, patchingData as any);

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

        patchingData = data.map(r => html`<span age=${r.age}>${r.name}</span>`);

        render(container, undefined, patchingData as any);

        expect(container.outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><span age=\"31\">Mark<!--_$node_--></span></div>');
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

        render(container, undefined, patchingData as any);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\">Sarah<!--_$node_--></span><span key=\"2\" age=\"31\">Mark<!--_$node_--></span></div>');

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

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        render(container, container, patchingData as any);

        expect(container.outerHTML).toEqual('<div><span key=\"2\" age=\"31\">Mark<!--_$node_--></span><span key=\"1\" age=\"19\">Sarah<!--_$node_--></span></div>');

        // Remove the children
        data = [];

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        render(container, container, patchingData as any);

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

        patchingData = data.map(r => html`<span key=${r.id} age=${r.age}>${r.name}</span>`);

        render(container, undefined, patchingData as any);

        expect(container.outerHTML).toEqual('<div><span key=\"1\" age=\"19\">Sarah<!--_$node_--></span><span key=\"2\" age=\"31\">Mark<!--_$node_--></span></div>');
    });

    it('should render nested single child', () => {

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

        render(container, undefined, containerPatchingData);

        // At this time the node should be created, ensure that the patching data has a reference to it
        const {
            node: containerNode
        } = containerPatchingData;

        expect((containerNode as HTMLElement).outerHTML).toEqual('<x-container class=\"container\"><x-item class=\"item\">\n                My name is: Sarah<!--_$node_--></x-item><!--_$node_--></x-container>');

        const {
            node: itemNode
        } = itemPatchingData;

        expect(itemNode).toBe(containerNode.childNodes[0]); // it should refer to the same child node

        expect((itemNode as HTMLElement).outerHTML).toEqual('<x-item class=\"item\">\n                My name is: Sarah<!--_$node_--></x-item>');

        expect(container.outerHTML).toEqual('<div><x-container class=\"container\"><x-item class=\"item\">\n                My name is: Sarah<!--_$node_--></x-item><!--_$node_--></x-container></div>');

        // Replace the name of the nested text
        name = "Mark";

        itemPatchingData = html`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        render(container, containerNode, containerPatchingData);

        expect(container.outerHTML).toEqual('<div><x-container class=\"container\"><x-item class=\"item\">\n                My name is: Mark<!--_$node_--></x-item><!--_$node_--></x-container></div>');

        // Remove the nested item
        itemPatchingData = null;

        containerPatchingData = html`
            <x-container class="container">       
                ${itemPatchingData}
            </x-container>
        `;

        render(container, containerNode, containerPatchingData);

        expect(container.outerHTML).toEqual('<div><x-container class=\"container\"><!--_$node_--></x-container></div>');
    });

    //////////////
    //     it('should add the nested virtual node as a child of the parent one', () => {

    //         const name = "Sarah";

    //         const nestedResult = html`
    //             <x-item class="item">
    //                 My name is: ${name}
    //             </x-item>
    //         `;

    //         const nestedVNode = nestedResult.vnode as ElementNode;

    //         expect(nestedVNode.tag).toEqual('x-item');

    //         expect(nestedVNode.attributes).toEqual({
    //             class: "item",
    //         });

    //         expect((nestedVNode.children[0] as TextNode).text.toString().trim()).toEqual('My name is: Sarah');

    //         expect(nestedResult.node).toBeDefined();

    //         const result = html`
    //             <x-container class="container">       
    //                 ${nestedResult}
    //             </x-container>
    //         `;

    //         const vnode = result.vnode as ElementNode;

    //         expect(vnode.tag).toEqual('x-container');

    //         expect(vnode.attributes).toEqual({
    //             class: "container",
    //         });

    //         expect(result.node).toBeDefined();

    //         const childVNode = vnode.children[0] as ElementNode;

    //         expect(childVNode).toBe(nestedVNode);

    //         expect((result.node as HTMLElement).childNodes[0]).toBe(nestedResult.node);
    //     });

    //     it('should render a complex object as a value', () => {

    //         const data = {
    //             name: "Sarah",
    //             age: 19,
    //             description: "Smart and beautiful"
    //         }

    //         const result = html`<x-container class="container" record=${data}></x-container>`;

    //         const vnode = result.vnode as ElementNode;

    //         expect(vnode.tag).toEqual('x-container');

    //         expect(vnode.attributes).toEqual({
    //             class: "container",
    //             record: "{\"name\":\"Sarah\",\"age\":19,\"description\":\"Smart and beautiful\"}"
    //         });

    //     });

    //     it('should attach events to the DOM node and remove the function name from the markup', () => {

    //         const handleClick = () => { };

    //         const result = html`<x-item onClick=${handleClick}></x-item>`;

    //         const vnode = result.vnode as ElementNode;

    //         expect(vnode.tag).toEqual('x-item');

    //         expect(vnode.attributes).toEqual(null); // The handler is not part of the attributes

    //         expect((result.node as any)._listeners['click']).toEqual([handleClick]);
    //     });

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

    //it('should create a virtual node tree from html markup', () => {

    //         const markup =
    //             `
    //                 <gcl-list-item value=1>       
    //                     <span>
    //                         <gcl-text>Name: Sarah</gcl-text>
    //                         Some text
    //                     </span>
    //                     <gcl-text>Date of Birth: 6/26/2003</gcl-text>

    //                     <gcl-text>Reputation: 10</gcl-text>

    //                     <gcl-text>Description: Very beautiful and smart</gcl-text>
    //                     <img style="width: 64px; height: 64px; border-radius: 50%;" src=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z />
    //                 </gcl-list-item>
    //             `;

    //         const vnode = markupToVirtualNode(markup, 'html', { excludeTextWithWhiteSpacesOnly: true }).vnode as ElementNode;

    //         expect(vnode.tag).toEqual('gcl-list-item');

    //         expect(vnode.attributes).toMatchObject({
    //             value: '1'
    //         });

    //         expect(vnode.children.length).toEqual(5);

    //         const spanVNode = vnode.children[0] as ElementNode;

    //         expect(spanVNode.tag).toEqual('span');

    //         const gclTextVNode = spanVNode.children[0] as ElementNode;

    //         expect(gclTextVNode.tag).toEqual('gcl-text');

    //         const textVNode = gclTextVNode.children[0] as TextNode;

    //         expect(textVNode).toEqual({ "text": "Name: Sarah" });

    //         const imgVNode = vnode.children[4] as ElementNode;

    //         expect(imgVNode.tag).toEqual('img');

    //         expect(imgVNode.attributes).toMatchObject({
    //             src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAZABMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2rVNTg0ixa6uBIw3KiRxLueR2OFRR6kkD09SBzWfbeJTLrFvpl3o2pWFxco7xG4ETIwUZPzRyMAenHWpPEjaO1hBbazcm3iublI4JBI0bLN95Crj7pyuQemeO+KpJLqWkeJdN06TVpdThvllLpdRRLLCEXO9TEqDaSVUgg8suCOhypwi4arXXv0XT9bmknY6aiiiucZXvLCz1CERXtpBcxg5CTRhwDgjofYkfQmoNO0PSNHaRtM0uysjIAJDbW6R78dM7QM9TV+iqU5Jct9ACiiipA//Z",
    //             style: "width: 64px; height: 64px; border-radius: 50%;",
    //         });
    //     });

    //     it('should throw an error when there is a script tag but the options are not set to allowScripts', () => {

    //         const markup =
    //             `
    //             <gcl-list-item value=1>       
    //                 <span><gcl-text>Name: Sarah</gcl-text>Some text</span>
    //                 <script></script>
    //                 <gcl-text>Date of Birth: 6/26/2003</gcl-text>
    //                 <gcl-text>Reputation: 10</gcl-text>
    //                 <gcl-text>Description: Very beautiful and smart</gcl-text>
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
    //         <span><gcl-text>Name: Sarah</gcl-text>Some text</span>
    //         <gcl-text>Date of Birth: 6/26/2003</gcl-text>
    //         <gcl-text>Reputation: 10</gcl-text>
    //         <gcl-text>Description: Very beautiful and smart</gcl-text>
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
    //         <span><gcl-text>Name: Sarah</gcl-text>Some text</span>
    //         <gcl-text>Date of Birth: 6/26/2003</gcl-text>
    //         <gcl-text>Reputation: 10</gcl-text>
    //         <gcl-text>Description: Very beautiful and smart</gcl-text>
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

    //         expect((vnode.children[1] as ElementNode).tag).toEqual('gcl-text');

    //         expect((vnode.children[2] as ElementNode).tag).toEqual('gcl-text');

    //         expect((vnode.children[3] as ElementNode).tag).toEqual('gcl-text');

    //         expect((vnode.children[4] as ElementNode).tag).toEqual('img');
    //     });

    //     // DOMParser for xml is not implemented in HappyDom yet
    //     // it('should create a node tree from xml markup', () => {

    //     //     const markup = 
    //     // `<gcl-list-item value=1>       
    //     //     <gcl-text>Name: Sarah</gcl-text>
    //     //     <gcl-text>Date of Birth: 6/26/2003</gcl-text>
    //     //     <gcl-text>Reputation: 10</gcl-text>
    //     //     <gcl-text>Description: Very beautiful and smart</gcl-text>
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

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span data=\"[{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19},{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31}]\"></span>');

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

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah<!--_$node_--></span>');

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

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age="_$attr:age"><!--_$node_--></span>');

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

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah<!--_$node_--></span>');

    //     expect((node.childNodes[1] as HTMLStyleElement).outerHTML).toEqual('<style>background-color:green;<!--_$node_--></style>');

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

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age="_$attr:age"><!--_$node_--></span>');

    //     expect((content.childNodes[1] as HTMLElement).outerHTML).toEqual('<style><!--_$node_--></style>');

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

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

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

    //     expect((content.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"_$attr:age\"><!--_$node_--></span><style><!--_$node_--></style></div>');

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

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');

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

});

