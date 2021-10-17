import html from "../html";
import { NodePatcherRuleTypes } from "../NodePatcher";

describe("html tag template tests", () => {

    it('should render a text node', () => {

        const name = "Sarah";

        const node = html`${name}`;

        expect(node.childNodes[0].textContent).toEqual(name);

        const instancePatchingData = (node as any).__instancePatchingData__;

        expect(instancePatchingData.values).toEqual([name]);

        const {
            sharedPatchingData
        } = instancePatchingData;

        const {
            _template,
            _patcher
        } = sharedPatchingData;

        const {
            content
        } = _template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect(content.childNodes[0].textContent).toEqual('_$child_');

        const {
            _rules
        } = _patcher;

        expect(_rules.length).toEqual(1);

        const rule = _rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_TEXT);

        expect(rule.path).toEqual([0]);
    });

    it('should render an attribute', () => {

        const name = "Sarah";

        const node = html`<span name=${name}></span>`;

        expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Sarah\"></span>');

        const instancePatchingData = (node as any).__instancePatchingData__;

        expect(instancePatchingData.values).toEqual([name]);

        const {
            sharedPatchingData
        } = instancePatchingData;

        const {
            _template,
            _patcher
        } = sharedPatchingData;

        const {
            content
        } = _template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect(content.childNodes[0].outerHTML).toEqual('<span name=\"_$attr:name\"></span>');

        const {
            _rules
        } = _patcher;

        expect(_rules.length).toEqual(1);

        const rule = _rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

        expect(rule.name).toEqual('name');

        expect(rule.path).toEqual([0]);
    });

    it('should render more that one attribute', () => {

        const name = "Sarah";

        const age = 19;

        const node = html`<span name=${name} age=${age}></span>`;

        expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Sarah\" age=\"19\"></span>');

        const instancePatchingData = (node as any).__instancePatchingData__;

        expect(instancePatchingData.values).toEqual([name, age]);

        const {
            sharedPatchingData
        } = instancePatchingData;

        const {
            _template,
            _patcher
        } = sharedPatchingData;

        const {
            content
        } = _template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect(content.childNodes[0].outerHTML).toEqual('<span name=\"_$attr:name\" age=\"_$attr:age\"></span>');

        const {
            _rules
        } = _patcher;

        expect(_rules.length).toEqual(2);

        let rule = _rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

        expect(rule.name).toEqual('name');

        expect(rule.path).toEqual([0]);

        rule = _rules[1];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

        expect(rule.name).toEqual('age');

        expect(rule.path).toEqual([0]);
    });

    it('should render one attribute and text child', () => {

        const age = 19;

        const name = "Sarah";

        const node = html`<span age=${age}>${name}</span>` as HTMLElement;

        expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah</span>');

        const instancePatchingData = (node as any).__instancePatchingData__;

        expect(instancePatchingData.values).toEqual([age, name]);

        const {
            sharedPatchingData
        } = instancePatchingData;

        const {
            _template,
            _patcher
        } = sharedPatchingData;

        const {
            content
        } = _template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect(content.childNodes[0].outerHTML).toEqual('<span age="_$attr:age"><!--_$child_--></span>');

        const {
            _rules
        } = _patcher;

        expect(_rules.length).toEqual(2);

        let rule = _rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

        expect(rule.name).toEqual('age');

        expect(rule.path).toEqual([0]);

        rule = _rules[1];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_TEXT);

        expect(rule.path).toEqual([0, 0]);
    });

    it('should render more than one element', () => {
        
        const age = 19;

        const name = "Sarah";

        const style = "background-color:green;"

        const node = html`<span age=${age}>${name}</span><style>${style}</style>` as HTMLElement;

        expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah</span>');

        expect((node.childNodes[1] as HTMLStyleElement).outerHTML).toEqual('<style>background-color:green;</style>');

        const instancePatchingData = (node as any).__instancePatchingData__;

        expect(instancePatchingData.values).toEqual([age, name, style]);

        const {
            sharedPatchingData
        } = instancePatchingData;

        const {
            _template,
            _patcher
        } = sharedPatchingData;

        const {
            content
        } = _template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect(content.childNodes[0].outerHTML).toEqual('<span age="_$attr:age"><!--_$child_--></span>');

        expect(content.childNodes[1].outerHTML).toEqual('<style><!--_$child_--></style>');

        const {
            _rules
        } = _patcher;

        expect(_rules.length).toEqual(3);

        let rule = _rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_ATTRIBUTE);

        expect(rule.name).toEqual('age');

        expect(rule.path).toEqual([0]);

        rule = _rules[1];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_TEXT);

        expect(rule.path).toEqual([0, 0]);

        rule = _rules[2];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_TEXT);

        expect(rule.path).toEqual([1, 0]);
    });

    it('should render a collection of non keyed children, empty container', () => {
        
        const data = [
            {
                name: 'Sarah',
                age: 19,
                style: "background-color:green;"
            },
            {
                name: 'Mark',
                age: 31,
                style: "background-color:yelow;"
            }
        ];

        const children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

        const node =  html`${children}` as HTMLElement;

        expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah</span><style>background-color:green;</style></div>');

        expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark</span><style>background-color:yelow;</style></div>');

        const instancePatchingData = (node as any).__instancePatchingData__;

        expect(instancePatchingData.values).toEqual([children]);

        const {
            sharedPatchingData
        } = instancePatchingData;

        const {
            _template,
            _patcher
        } = sharedPatchingData;

        const {
            content
        } = _template;

        expect(content).toBeInstanceOf(DocumentFragment);

        expect(content.childNodes[0].textContent).toEqual('_$child_');

        const {
            _rules
        } = _patcher;

        expect(_rules.length).toEqual(1);

        let rule = _rules[0];

        expect(rule.type).toEqual(NodePatcherRuleTypes.PATCH_TEXT);

        expect(rule.path).toEqual([0]);
    });

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