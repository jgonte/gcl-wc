import { NodePatcher, NodePatchingData } from "./NodePatcher";

const cache = new Map<string, NodePatcher>();

export default function html(strings: TemplateStringsArray, ...values: any): NodePatchingData {

    const key = strings.toString();

    let patcher = cache.get(key);

    if (patcher === undefined) {

        patcher = new NodePatcher(strings);

        cache.set(key, patcher);
    }

    // Return a new patching data with the shared patcher
    return {
        patcher,
        rules: null,
        values
    };
}