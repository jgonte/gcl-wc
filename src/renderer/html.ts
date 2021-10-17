import NodeSharedPatchingData from "./NodeSharedPatchingData";

const patchingDataCache = new WeakMap<TemplateStringsArray, NodeSharedPatchingData>();

export default function html(strings: TemplateStringsArray, ...values: any): Node {

    let sharedPatchingData = patchingDataCache.get(strings);

    if (sharedPatchingData === undefined) {

        sharedPatchingData = new NodeSharedPatchingData(strings);

        patchingDataCache.set(strings, sharedPatchingData);
    }

    return sharedPatchingData.createNode([], values);
}
