export const nodeMarker = "_$node_";

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

    const length = strings.length - 1; // Exclude the last one

    let s: string = undefined;

    for (let i = 0; i < length; ++i) {

        s = strings[i];

        if (i === 0) {

            s = s.trimStart();
        }

        if (s.endsWith('=')) { // It is an attribute

            const name = getAttributeName(s);

            if (name[0] === 'o' && name[1] === 'n') { // It is an event handler

                parts.push(`${s}"${eventMarkerPrefix}${name}"`);
            }
            else {

                if (name === 'key') {

                    keyIndex = i;
                }

                parts.push(`${s}"${attributeMarkerPrefix}${name}"`);
            }
        }
        else if (!noSelfClosingTagAfter(strings, i)) { // Ensure the marker is not placed inside an auto-closing node

            s = minify(s);

            parts.push(`${s}<!--${nodeMarker}-->`);
        }
        else { // Literal

            parts.push(s);
        }
    }

    // Add the ending string
    s = strings[length].trimEnd();

    s = minify(s);

    parts.push(s);

    return {
        templateString: parts.join(''),
        keyIndex
    };
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

const regexSelfClosingTag = /\/>/;

function noSelfClosingTagAfter(strings: TemplateStringsArray, i: number): boolean {

    for (; i < strings.length; ++i) {

        if (regexSelfClosingTag.test(strings[i])) {

            return true;
        }
    }

    return false;
}

function minify(s: string) {

    return s.replace(/[\t\n ]+\</g, '<') // Remove whitespace before opening tags
        .replace(/\>[\t\n ]+$/g, '>'); // Remove whitespace after tags
}
