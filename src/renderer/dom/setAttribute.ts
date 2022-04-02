export default function setAttribute(node: HTMLElement, key: string, value: string) {

    if (value === undefined ||
        value === 'undefined' ||
        value === 'null' ||
        value === '' ||
        value === 'false') {

        node.removeAttribute(key);

        // Reset the value in any case
        if (key === 'value' && value === undefined) { // It fails with undefined for a text field value

            (node as any)[key] = '';
        }
        else {

            (node as any)[key] = value;
        }
    }
    else {

        if (value === 'true') {

            node.setAttribute(key, '');
        }
        else {

            const type = typeof value;

            if (type === 'function') {

                node.removeAttribute(key); // It is similar to an event. Do not show as attribute

                (node as any)[key] = value; // Bypass the stringification of the attribute
            }
            else if (type === 'object') {

                value = JSON.stringify(value);

                node.setAttribute(key, value);
            }
            else { // Any other type

                if (key === 'value') { // Set the value besides setting the attribute

                    (node as HTMLInputElement).value = value;
                }

                node.setAttribute(key, value);
            }
        }
    }
}

