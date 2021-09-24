export default function isVirtualNode(value: any) {

    return ('tag' in value &&
        'attributes' in value &&
        'children' in value);
}