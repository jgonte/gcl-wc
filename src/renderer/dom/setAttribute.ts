export default function setAttribute(node: HTMLElement | Record<string, any>, attributeName: string, propertyName: string, value: string): void {

    if (value === undefined ||
        value === 'undefined' ||
        value === 'null' ||
        value === '' ||
        value === 'false') {

        node.removeAttribute(attributeName);

        // Reset the value in any case
        if (attributeName === 'value' && value === undefined) { // It fails with undefined for a text field value

            node[propertyName] = '';
        }
        else {

            node[propertyName] = value;
        }
    }
    else {

        if (value === 'true') {

            node.setAttribute(attributeName, '');
        }
        else {

            const type = typeof value;

            if (type === 'function') {

                node.removeAttribute(attributeName); // It is similar to an event. Do not show as attribute

                node[propertyName] = value; // Bypass the stringification of the attribute
            }
            else if (type === 'object') {

                value = JSON.stringify(value);

                node.setAttribute(attributeName, value);
            }
            else { // Any other type

                if (attributeName === 'value') { // Set the value besides setting the attribute

                    (node as HTMLInputElement).value = value;
                }

                node.setAttribute(attributeName, value);
            }
        }
    }
}

