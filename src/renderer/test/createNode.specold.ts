// import { createNode } from "../createNode";
// import { beginMarker, endMarker } from "../createTemplate";
// import html from "../html";

// describe("create node tests", () => {

//     it('should create a text node', () => {

//         const name = 'Sarah';

//         const patchingData = html`${name}`;

//         const fragment = document.createDocumentFragment();

//         const node = createNode(fragment, patchingData);

//         expect(node.nodeType).toEqual(Node.DOCUMENT_FRAGMENT_NODE);

//         expect((node as any)._$patchingData).toBeUndefined(); // The patching data is not set in a document fragment since it looses its children when added to a parent

//         // TODO: Verify the assumption below if not, the do not allow document fragments as a parent node
//         // The parent node is a fragment. Shadow DOMs are document fragments
//         expect(patchingData.node).toEqual(fragment);

//         const {
//             childNodes
//         } = node;

//         let comment = childNodes[0] as Comment;

//         expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

//         expect(comment.data).toEqual(beginMarker);

//         const text = childNodes[1] as Text;

//         expect(text.nodeType).toEqual(Node.TEXT_NODE);

//         expect(text.textContent).toEqual('Sarah');

//         comment = childNodes[2] as Comment;

//         expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

//         expect(comment.data).toEqual(endMarker);
//     });

//     it('should create a literal', () => {

//         const patchingData = html`<span>literal</span>`;

//         const node = createNode(undefined, patchingData) as HTMLElement;

//         expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

//         expect((node as any)._$patchingData).toEqual(patchingData);

//         expect(node.outerHTML).toEqual('<span>literal</span>');
//     });

//     it('should create an element with a child text node', () => {

//         const name = 'Sarah';

//         const patchingData = html`<span>${name}</span>`;

//         const node = createNode(undefined, patchingData);

//         expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

//         expect((node as any)._$patchingData).toEqual(patchingData);

//         const {
//             childNodes
//         } = node;

//         let comment = childNodes[0] as Comment;

//         expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

//         expect(comment.data).toEqual(beginMarker);

//         const text = childNodes[1] as Text;

//         expect(text.nodeType).toEqual(Node.TEXT_NODE);

//         expect(text.textContent).toEqual('Sarah');

//         comment = childNodes[2] as Comment;

//         expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

//         expect(comment.data).toEqual(endMarker);
//     });

//     it('should create an element with attributes', () => {

//         const record = { "name": "Sarah", "age": "19", "description": "Beautiful and smart" };

//         const field = 'name';

//         const patchingData = html`
//         <gcl-data-cell 
//             field=${field} 
//             record=${record} 
//             key=${field}>
//         </gcl-data-cell>`;

//         const node = createNode(undefined, patchingData) as HTMLElement;

//         // Verify the patching data
//         const {
//             node: newNode,
//             patcher,
//             rules,
//             values
//         } = patchingData;

//         expect(node).toBe(newNode);

//         expect(rules.length).toEqual(3);

//         expect(values).toEqual([
//             "name",
//             {
//                 name: "Sarah",
//                 age: "19",
//                 description: "Beautiful and smart",
//             },
//             "name",
//         ]);

//         const {
//             templateString,
//             template,
//             keyIndex,
//         } = patcher;

//         expect(templateString).toEqual("<gcl-data-cell \n            field=\"_$attr:field\" \n            record=\"_$attr:record\" \n            key=\"_$attr:key\">\n        </gcl-data-cell>");

//         const {
//             childNodes: templateChildren
//         } = template.content;

//         expect(templateChildren.length).toEqual(1);

//         expect(keyIndex).toEqual(2);

//         // Verify the nodes
//         expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

//         expect((node as any)._$patchingData).toEqual(patchingData);

//         const {
//             childNodes
//         } = node;

//         expect(childNodes.length).toEqual(1);

//         expect(node.attributes.length).toEqual(3);

//         expect(node.getAttribute('field')).toEqual('name');

//         expect(node.getAttribute('record')).toEqual(JSON.stringify(record));

//         expect(node.getAttribute('key')).toEqual('name');
//     });

//     it('should create an SVG element with attributes', () => {

//         const iconsPath = '/dist/assets/icons';

//         const name = 'alarm';

//         const iconPath = `${iconsPath}#${name}`;

//         const patchingData = html`
//             <svg role="img">
//                 <use href=${iconPath} />
//             </svg>`;

//         const node = createNode(undefined, patchingData) as HTMLElement;

//         // Verify the patching data
//         const {
//             node: newNode,
//             patcher,
//             rules,
//             values
//         } = patchingData;

//         expect(node).toBe(newNode);

//         expect(rules.length).toEqual(1);

//         expect(values).toEqual([
//             '/dist/assets/icons#alarm'
//         ]);

//         const {
//             templateString,
//             template,
//             keyIndex,
//         } = patcher;

//         expect(templateString).toEqual("<svg role=\"img\">\n                <use href=\"_$attr:href\" />\n            </svg>");

//         const {
//             childNodes: templateChildren
//         } = template.content;

//         expect(templateChildren.length).toEqual(1);

//         expect(keyIndex).toEqual(undefined);

//         // Verify the nodes
//         expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

//         expect((node as any)._$patchingData).toEqual(patchingData);

//         expect(node.outerHTML).toEqual("<svg role=\"img\">\n                <use href=\"/dist/assets/icons#alarm\"/>\n            </svg>");
//     });

//     it('should create an element with nested children', () => {

//         const data = {
//             name: "Sarah",
//             age: 19,
//             description: "Beautiful and smart",
//             skills: [
//                 {
//                     id: 1,
//                     description: "Artist"
//                 },
//                 {
//                     id: 2,
//                     description: "Medicine"
//                 }
//             ]
//         };

//         const {
//             name,
//             age,
//             description,
//             skills
//         } = data;

//         const patchingData = html`<div style="width: 200px; margin: 10px;">
//         <div style="background-color: lightgreen; padding: 5px;">${name}</div>
//         <div style="background-color: yellow;">${age}</div>
//         <div style="background-color: darkred; color: white; font-weight: bold;">${description}</div>
//         <gcl-data-list id-field="id" data=${skills}></gcl-data-list>
//     </div>`;

//         const node = createNode(undefined, patchingData) as HTMLElement;

//         // Verify the patching data
//         const {
//             node: newNode,
//             patcher,
//             rules,
//             values
//         } = patchingData;

//         expect(node).toBe(newNode);

//         expect(rules.length).toEqual(4);

//         expect(values).toEqual([
//             "Sarah",
//             19,
//             "Beautiful and smart",
//             [
//                 {
//                     id: 1,
//                     description: "Artist"
//                 },
//                 {
//                     id: 2,
//                     description: "Medicine"
//                 }
//             ]
//         ]);

//         const {
//             templateString,
//             template,
//             keyIndex,
//         } = patcher;

//         expect(templateString).toEqual("<div style=\"width: 200px; margin: 10px;\">\n        <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_--><!--_$em_--></div>\n        <div style=\"background-color: yellow;\"><!--_$bm_--><!--_$em_--></div>\n        <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_--><!--_$em_--></div>\n        <gcl-data-list id-field=\"id\" data=\"_$attr:data\"></gcl-data-list>\n    </div>");

//         const {
//             childNodes: templateChildren
//         } = template.content;

//         expect(templateChildren.length).toEqual(1);

//         expect(keyIndex).toEqual(undefined);

//         // Verify the nodes
//         expect(node.nodeType).toEqual(Node.ELEMENT_NODE);

//         expect((node as any)._$patchingData).toEqual(patchingData);

//         expect(node.outerHTML).toEqual("<div style=\"width: 200px; margin: 10px;\">\n        <div style=\"background-color: lightgreen; padding: 5px;\"><!--_$bm_-->Sarah<!--_$em_--></div>\n        <div style=\"background-color: yellow;\"><!--_$bm_-->19<!--_$em_--></div>\n        <div style=\"background-color: darkred; color: white; font-weight: bold;\"><!--_$bm_-->Beautiful and smart<!--_$em_--></div>\n        <gcl-data-list id-field=\"id\" data=\"[{&quot;id&quot;:1,&quot;description&quot;:&quot;Artist&quot;},{&quot;id&quot;:2,&quot;description&quot;:&quot;Medicine&quot;}]\"></gcl-data-list>\n    </div>");
//     });

// });