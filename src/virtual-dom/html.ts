import packText from "../utils/packText";
import markupToVirtualNode from "./helpers/markupToVirtualNode";
import { VirtualNode } from "./interfaces";

/**
 * Template tag to generate the virtual node from the string
 */
export default function html(strings: TemplateStringsArray, ...values: any): VirtualNode | string | null {

    const markup = values.reduce(
        (acc, val, idx) => [...acc, val, packText(strings[idx + 1])],
        [packText(strings[0])]
    ).join('');

    return markupToVirtualNode(markup, 'html');
}
