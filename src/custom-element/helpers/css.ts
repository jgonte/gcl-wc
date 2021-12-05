/**
 * Template tag to generate the styles
 */
export default function css(strings: TemplateStringsArray, ...values: any) : string{

    return values.reduce(
        (acc, val, idx) => [...acc, val, strings[idx + 1]],
        [strings[0]]
    ).join('');
}

