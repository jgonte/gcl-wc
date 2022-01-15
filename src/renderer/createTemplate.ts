/**
 * Marks the end of a string and the beginning of a value
 */
export const beginMarker = "_$bm_";

/**
 * Marks the end of a value and the beginning of a string
 */
export const endMarker = "_$em_";

// Referenced to avoid converting the value of the attribute for templates
export const attributeMarkerPrefix = "_$attr:";

export const eventMarkerPrefix = "_$evt:";

export interface TemplateData {

    templateString: string;

    template: HTMLTemplateElement;

    keyIndex: number;
}

export default function createTemplate(strings: TemplateStringsArray): TemplateData {

    const template = document.createElement('template');

    const {
        templateString,
        keyIndex
    } = createTemplateString(strings);

    template.innerHTML = templateString;

    return {
        templateString,
        template,
        keyIndex
    };
}

function createTemplateString(strings: TemplateStringsArray): { templateString: string, keyIndex: number } {

    let keyIndex: number = undefined; // The index of the key to get the value from the values array

    const parts: string[] = [];

    if (strings.length === 1) { // No values ... literal only

        return {
            templateString: strings[0],
            keyIndex
        };
    }

    const length = strings.length - 1; // Exclude the last one

    let s: string = undefined;

    // Flag to indicate state whether we are dealing with a value for an attribute or an event
    let beginAttributeOrEvent: boolean = false;

    for (let i = 0; i < length; ++i) {

        s = strings[i];

        s = trimNode(s);

        if (s.endsWith('=')) { // It is an attribute or an event

            const name = getAttributeName(s);

            beginAttributeOrEvent = true;

            if (name[0] === 'o' && name[1] === 'n') { // It is an event handler

                parts.push(`${s}"${eventMarkerPrefix}${name}"`);
            }
            else { // Not an event

                if (name === 'key') {

                    keyIndex = i;
                }

                parts.push(`${s}"${attributeMarkerPrefix}${name}"`);
            }
        }
        else { // It is the beginning of a text or element

            if (beginAttributeOrEvent === true) {

                beginAttributeOrEvent = false; // Clear the attribute flag
            }
            else if (i > 0) { // Ignore the first string

                parts.push(`<!--${endMarker}-->`); // End the previous node
            }

            parts.push(`${s}<!--${beginMarker}-->`);
        }
    }

    // Add the ending string
    if (beginAttributeOrEvent === false) { // End of a text or element

        parts.push(`<!--${endMarker}-->`);
    }

    s = strings[length];

    s = trimNode(s);

    parts.push(s);

    return {
        templateString: parts.join(''),
        keyIndex
    };
}

function trimNode(s: string) : string {

    const trimmedStart = s.trimStart();

    if (trimmedStart.startsWith('<') ||
        trimmedStart === '') {

        s = trimmedStart; // Remove any empty text nodes at the start so there are not extra unnecessary children
    }

    const trimmedEnd = s.trimEnd();

    if (trimmedEnd.endsWith('>')) {

        s = trimmedEnd;
    }

    return s;
}

function getAttributeName(s: string): string {

    let b: string[] = [];

    for (let i = s.lastIndexOf('=') - 1; i >= 0; --i) {

        if (s[i] === ' ') { // Finished with the name of the attribute

            break;
        }

        b = [s[i], ...b]; // Prepend
    }

    return b.join('');
}