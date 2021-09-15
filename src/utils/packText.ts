export default function packText(text: string) {

    return text.replace(/\s|\n|\r/g,'');
}