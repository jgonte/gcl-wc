import createTemplate, { beginMarker, endMarker } from "../createTemplate";

const extractTemplateStringArrays = (strings: TemplateStringsArray, ...values: any): TemplateStringsArray => strings;

describe("create template tests", () => {

    it('should create a simple text node template', () => {

        let name = "Sarah";

        const strings = extractTemplateStringArrays`${name}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('<!--_$bm_--><!--_$em_-->');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(2);

        let node = childNodes[0];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(beginMarker);

        node = childNodes[1];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(endMarker);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a literal template', () => {

        const strings = extractTemplateStringArrays`<input type="text" name="name"/>`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('<input type="text" name="name"/>');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1); // INPUT

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a two side by side text nodes template', () => {

        const name = "Sarah";

        const age = 19; 

        const strings = extractTemplateStringArrays`${name}${age}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('<!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_-->');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(4);

        let node = childNodes[0];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(beginMarker);

        node = childNodes[1];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(endMarker);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a text node template', () => {

        let name = "Sarah";

        const strings = extractTemplateStringArrays`Name: ${name}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('Name: <!--_$bm_--><!--_$em_-->');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        let node = childNodes[1];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(beginMarker);

        node = childNodes[2];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual(endMarker);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create an element template', () => {

        let name = "Sarah";

        const strings = extractTemplateStringArrays`
            <x-item class="item">
                My name is: ${name}
            </x-item>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            <x-item class=\"item\">\n                My name is: <!--_$bm_--><!--_$em_-->\n            </x-item>\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        const node = childNodes[1];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create an element template with one attribute', () => {

        const name = "Sarah";

        const age = 19;

        const strings = extractTemplateStringArrays`
            <x-item class="item" age=${age}>
                My name is: ${name}
            </x-item>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            <x-item class=\"item\" age=\"_$attr:age\">\n                My name is: <!--_$bm_--><!--_$em_-->\n            </x-item>\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        const node = childNodes[1];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create an element template with two attributes', () => {

        const name = "Sarah";

        const age = 19;

        const description = "Smart and beautiful";

        const strings = extractTemplateStringArrays`
            <x-item class="item" age=${age} description=${description}>
                My name is: ${name}
            </x-item>
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            <x-item class=\"item\" age=\"_$attr:age\" description=\"_$attr:description\">\n                My name is: <!--_$bm_--><!--_$em_-->\n            </x-item>\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        const node = childNodes[1];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a self-closing element template with two attributes', () => {

        const name = "Sarah";

        const description = "Smart and beautiful";

        const strings = extractTemplateStringArrays`
            <x-item class="item" name=${name} description=${description} />
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            <x-item class=\"item\" name=\"_$attr:name\" description=\"_$attr:description\" />\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

        const node = childNodes[1];

        expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

        expect((node as HTMLElement).tagName).toEqual('X-ITEM');

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with several nodes (1)', () => {

        let header = "Header";

        let name = "Sarah";

        let footer = "Header";

        const strings = extractTemplateStringArrays`
            ${header}
            <x-item class="item">
                My name is: ${name}
            </x-item>
            ${footer}
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            <!--_$bm_--><!--_$em_-->\n            <x-item class=\"item\">\n                My name is: <!--_$bm_--><!--_$em_-->\n            </x-item>\n            <!--_$bm_--><!--_$em_-->\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(9);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with several nodes (2)', () => {

        let header = "Header";

        let name = "Sarah";

        let footer = "Header";

        const strings = extractTemplateStringArrays`
            Header: ${header}
            <x-item class="item">
                My name is: ${name}
            </x-item>
            Footer: ${footer}
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            Header: <!--_$bm_--><!--_$em_-->\n            <x-item class=\"item\">\n                My name is: <!--_$bm_--><!--_$em_-->\n            </x-item>\n            Footer: <!--_$bm_--><!--_$em_-->\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(9);

        expect(keyIndex).toEqual(undefined);
    });

    it('should create a template with several nodes: x-item is self-closing', () => {

        let header = "Header";

        let footer = "Header";

        const strings = extractTemplateStringArrays`
            Header: ${header}
            <x-item class="item" />
            Footer: ${footer}
        `;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('\n            Header: <!--_$bm_--><!--_$em_-->\n            <x-item class=\"item\" />\n            Footer: <!--_$bm_--><!--_$em_-->\n        ');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(9);

        expect(keyIndex).toEqual(undefined);
    });
});