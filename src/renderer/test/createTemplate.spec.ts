import createTemplate from "../createTemplate";

const extractTemplateStringArrays = (strings: TemplateStringsArray, ...values: any): TemplateStringsArray => strings;

describe("create template tests", () => {

    it('should create a text node template', () => {

        let name = "Sarah";

        const strings = extractTemplateStringArrays`${name}`;

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        expect(templateString).toEqual('<!--_$node_-->');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

        expect(node.nodeType).toEqual(Node.COMMENT_NODE);

        expect((node as Comment).data).toEqual('_$node_');

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

        expect(templateString).toEqual('<x-item class=\"item\">\n                My name is: <!--_$node_--></x-item>');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(1);

        const node = childNodes[0];

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

        expect(templateString).toEqual('<!--_$node_--><x-item class=\"item\">\n                My name is: <!--_$node_--></x-item><!--_$node_-->');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(3);

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

        expect(templateString).toEqual('Header: <!--_$node_--><x-item class=\"item\">\n                My name is: <!--_$node_--></x-item>\n            Footer: <!--_$node_-->');

        const {
            childNodes
        } = template.content;

        expect(childNodes.length).toEqual(5);

        expect(keyIndex).toEqual(undefined);
    });
});