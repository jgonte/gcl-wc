export interface PackOptions {

    removeWhiteSpaces?: boolean
}

export default function packText(text: string, options: PackOptions = {}) {

    if (options.removeWhiteSpaces === undefined) {

        options.removeWhiteSpaces = true; // True by default
    }

    if (options.removeWhiteSpaces === true) {

        return text.replace(/\s|\n|\r/g,'');
    }
    else {

        return text.replace(/\n|\r/g,'');
    }
}