/**
 * Template tag to generate the styles
 */
export default function css(strings: TemplateStringsArray, ...values: any) {

    const parts = values.reduce(
        (acc, val, idx) => [ ...acc, val, uglifyText(strings[idx + 1])],
        [uglifyText(strings[0])]
    );

    return parts.join('');
}

function uglifyText(text: string) {

    const ugly = text.replace(/\s|\n|\r/g,'');

    return ugly;

}