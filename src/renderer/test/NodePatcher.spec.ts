// import html from "../html";
// import patch from "../renderer";

describe("patching a DOM node test", () => {

    // it("should patch an attribute in an element", () => {

    //     let name = "Sarah";

    //     const node = html`<span name=${name}></span>`;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Sarah\"></span>');

    //     name = "Mark";

    //     const newNode = html`<span name=${name}></span>`;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Mark\"></span>');
    // });

    // it("should patch more than one attribute in an element", () => {

    //     let name = "Sarah";

    //     let age = 19;

    //     const node = html`<span name=${name} age=${age}></span>`;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Sarah\" age=\"19\"></span>');

    //     name = "Mark";

    //     age = 31;

    //     const newNode = html`<span name=${name} age=${age}></span>`;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span name=\"Mark" age=\"31\"></span>');
    // });

    // it("should patch one attribute and a text child", () => {

    //     let age = 19;

    //     let name = "Sarah";

    //     const node = html`<span age=${age}>${name}</span>` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah<!--_$node_--></span>');

    //     age = 31;

    //     name = "Mark";

    //     const newNode = html`<span age=${age}>${name}</span>` as HTMLElement;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"31\">Mark<!--_$node_--></span>');
    // });

    // it("should patch more than one element", () => {

    //     let age = 19;

    //     let name = "Sarah";

    //     let style = "background-color:green;"

    //     const node = html`<span age=${age}>${name}</span><style>${style}</style>` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"19\">Sarah<!--_$node_--></span>');

    //     expect((node.childNodes[1] as HTMLStyleElement).outerHTML).toEqual('<style>background-color:green;<!--_$node_--></style>');

    //     age = 31;

    //     name = "Mark";

    //     style = "background-color:yellow;"

    //     const newNode = html`<span age=${age}>${name}</span><style>${style}</style>` as HTMLElement;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<span age=\"31\">Mark<!--_$node_--></span>');

    //     expect((node.childNodes[1] as HTMLStyleElement).outerHTML).toEqual('<style>background-color:yellow;<!--_$node_--></style>');
    // });

    // it('should render more a relatively complex element', () => {

    //     let age = 19;

    //     let name = "Sarah";

    //     let style = "background-color:green;"

    //     const node = html`<div><span age=${age}>${name}</span><style>${style}</style></div>` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

    //     // Patch the node
    //     age = 31;

    //     name = "Mark";

    //     style = "background-color:yellow;"

    //     const newNode = html`<div><span age=${age}>${name}</span><style>${style}</style></div>` as HTMLElement;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yellow;<!--_$node_--></style></div>');
    // });

    // it("should add the children of an element", () => {

    //     let data = [];

    //     let children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const node = html`${children}` as HTMLElement;

    //     expect(node.childNodes.length).toEqual(1);

    //     expect(node.childNodes[0]).toBeInstanceOf(Comment);

    //     data = [
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

    //     children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const newNode = html`${children}` as HTMLElement;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');
    // });

    // it("should remove the children of an element", () => {

    //     let data = [
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

    //     let children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const node = html`${children}` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');

    //     data = [];

    //     children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const newNode = html`${children}` as HTMLElement;

    //     patch(node, newNode);

    //     expect(node.childNodes.length).toEqual(1);

    //     expect(node.childNodes[0]).toBeInstanceOf(Comment);
    // });

    // it("should swap the non-keyed children of an element", () => {

    //     let data = [
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

    //     let children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const node = html`${children}` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');

    //     data = [
    //         {
    //             name: 'Mark',
    //             age: 31,
    //             style: "background-color:yelow;"
    //         },
    //         {
    //             name: 'Sarah',
    //             age: 19,
    //             style: "background-color:green;"
    //         }
    //     ];

    //     children = data.map(r => html`<div><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const newNode = html`${children}` as HTMLElement;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');    
    // });

    // it("should swap the keyed children of an element", () => {

    //     let data = [
    //         {
    //             id: 1,
    //             name: 'Sarah',
    //             age: 19,
    //             style: "background-color:green;"
    //         },
    //         {
    //             id: 2,
    //             name: 'Mark',
    //             age: 31,
    //             style: "background-color:yelow;"
    //         }
    //     ];

    //     let children = data.map(r => html`<div key=${r.id}><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const node = html`${children}` as HTMLElement;

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div key=\"1\"><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div key=\"2\"><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');

    //     data = [
    //         {
    //             id: 2,
    //             name: 'Mark',
    //             age: 31,
    //             style: "background-color:yelow;"
    //         },
    //         {
    //             id: 1,
    //             name: 'Sarah',
    //             age: 19,
    //             style: "background-color:green;"
    //         }
    //     ];

    //     children = data.map(r => html`<div key=${r.id}><span age=${r.age}>${r.name}</span><style>${r.style}</style></div>`);

    //     const newNode = html`${children}` as HTMLElement;

    //     patch(node, newNode);

    //     expect((node.childNodes[0] as HTMLElement).outerHTML).toEqual('<div key=\"2\"><span age=\"31\">Mark<!--_$node_--></span><style>background-color:yelow;<!--_$node_--></style></div>');

    //     expect((node.childNodes[1] as HTMLElement).outerHTML).toEqual('<div key=\"1\"><span age=\"19\">Sarah<!--_$node_--></span><style>background-color:green;<!--_$node_--></style></div>');    
    // });

});