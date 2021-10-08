export function isBlankOrWhiteSpace(s): boolean {

    return s === '' || /^\s+$/.test(s);
}

