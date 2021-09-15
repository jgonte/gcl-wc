import packText from "../../utils/packText";

/**
 * Template tag to generate the styles
 */
export default function css(strings: TemplateStringsArray, ...values: any) {

    const parts = values.reduce(
        (acc, val, idx) => [ ...acc, val, packText(strings[idx + 1])],
        [packText(strings[0])]
    );

    return parts.join('');
}
